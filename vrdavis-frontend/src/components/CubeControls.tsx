import React, { useRef, useState, PropsWithChildren, useMemo, useContext, useEffect } from 'react';
import { useController, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';
import { observer } from 'mobx-react';
import { RootContext } from '../store.context';
import { subtract3D } from '../utilities';

const signedAngleTo = (u: THREE.Vector3, v: THREE.Vector3): number => {
    // get the signed angle between u and v, in the range [-pi, pi]
    const angle = v.angleTo(u);
    const normal = v.clone().sub(u).normalize();
    return normal.z * angle;
}

const CubeControlsView: React.FC<PropsWithChildren> = ({children}) => {
    const { rootStore } = useContext(RootContext);
    
    const ref = useRef<THREE.Mesh>();
    const crop = useRef<THREE.Mesh>();
    const controls = useRef<THREE.Mesh>();

    const [width, setWidth] = useState(0.01);
    const [length, setLength] = useState(0.01);
    const [height, setHeight] = useState(0.01);

    const [minSize] = useState(0.5);
    const [maxSize] = useState(2.0);

    let rightSelect = false;
    let leftSelect = false;

    const rightController = useController("right");
    const leftController = useController("left");

    let prevDistance = 0;
    const scaleFactor = 0.01;
    const movementMultiplier = 5;

    let prevRightPos = rightController?.controller.position;
    let prevLeftPos = leftController?.controller.position;

    let midpoint = new THREE.Vector3();

    let prevLeftDir = new THREE.Vector3();
    let prevRightDir = new THREE.Vector3();

    // crop selection cube
    let offset = useMemo(() => [0,0,0], [])
    const [distance, setDistance] = useState(new THREE.Vector3());
    let cropScaleFactor = 220;

    const geometryCube = useMemo(() => new THREE.BoxGeometry( width, length, height ), [width, height, length]);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry( geometryCube ), [geometryCube]);
    const materialCube = useMemo(() => new THREE.LineBasicMaterial({
        color: 0x00FF00,
        fog: false,
        linewidth: 1, // 1 regardless of set value
        linecap: 'round',
        linejoin: 'round'
    }), []);

    const edges = useMemo(() => new THREE.LineSegments( edgesGeometry, materialCube ), [edgesGeometry, materialCube]);

    useEffect(() => {
        if(!rightController) return;
        crop.current!.add(edges);
        crop.current!.position.set(
            rightController!.controller.position.x + offset[0], 
            rightController!.controller.position.y - offset[1], 
            rightController!.controller.position.z + offset[2]
        );
    }, [edges, offset, rightController]);
    
    useFrame(() => {
        if(!leftController || !rightController) {
            return;
        }

        const leftPos = leftController.controller.position
        const rightPos = rightController.controller.position;
        
        if(rootStore.cubeStore.getCropMode() && rightSelect) {
            // track the contollers position and the distance it is from the spawn point
            setDistance(rightController!.controller.position.sub(crop.current!.position));
            crop.current!.scale.set(distance.x * cropScaleFactor, distance.y * cropScaleFactor, distance.z * cropScaleFactor);
            offset[0] = crop.current!.scale.x/2;
            offset[1] = crop.current!.scale.y/2;
            offset[2] = crop.current!.scale.z/2;
            // align crop cube with larger cube
            crop.current!.rotation.copy(ref.current!.rotation);
        } else {
            if(ref.current && (prevLeftPos && prevRightPos)) {
                midpoint = leftPos.clone().sub(rightPos).divideScalar(2);
                var rightDir = midpoint.clone().sub(rightPos).normalize();
                
                let offsetLeft = leftPos.clone().sub(prevLeftPos);
                let offsetRight = rightPos.clone().sub(prevRightPos);

                if(leftSelect && rightSelect)
                {
                    // rotation controls
                    let rightAngle = signedAngleTo(prevRightDir, rightDir);
                    ref.current.rotateOnAxis(new THREE.Vector3(0,1,0), rightAngle);

                    // scale controls
                    const distance = leftPos.distanceTo(rightPos);
                    const scale = ref.current.scale;
                    
                    if(distance > prevDistance && scale.x <= maxSize) // scale increases
                    {
                        ref.current.scale.addScalar(scaleFactor);
                    }
                    else if(distance < prevDistance && scale.x >= minSize) // scale decreases
                    {
                        ref.current.scale.subScalar(scaleFactor);
                    }
                    prevDistance = distance;
                }
                else if(leftSelect) // translation controls
                {
                    ref.current.position.add(offsetLeft.multiplyScalar(movementMultiplier));
                    rootStore.cubeStore.setWorldspaceCenter(ref.current.position.x, ref.current.position.y, ref.current.position.z);
                }
                else if(rightSelect)
                {
                    ref.current.position.add(offsetRight.multiplyScalar(movementMultiplier));
                    rootStore.cubeStore.setWorldspaceCenter(ref.current.position.x, ref.current.position.y, ref.current.position.z)
                }

                prevRightPos = rightPos.clone();
                prevLeftPos = leftPos.clone();

                prevRightDir = rightDir;
            }
        }

    });

    useXREvent('selectstart', () => { 
        rightSelect = true; 
        crop.current!.position.set(
            rightController!.controller.position.x, 
            rightController!.controller.position.y, 
            rightController!.controller.position.z);
    }, {handedness: 'right'});

    useXREvent('selectstart', () => {
        leftSelect = true;
    }, {handedness: 'left'});

    useXREvent('selectend', () => { 
        rightSelect = false; 
        const localCenter = subtract3D(crop.current!.position, rootStore.cubeStore.worldspaceCenter /*{x: 0, y: 1.5, z:-1}*/)
        rootStore.cubeStore.setCubeDims(
            {
                x: Math.abs(crop.current!.scale.x),
                y: Math.abs(crop.current!.scale.y),
                z: Math.abs(crop.current!.scale.z)
            },
            {
                x: (localCenter.x / (rootStore.cubeStore.scaleFactor * ref.current!.scale.x)) + rootStore.reconstructionStore.width / 2,
                y: (localCenter.y / (rootStore.cubeStore.scaleFactor * ref.current!.scale.y)) + rootStore.reconstructionStore.height / 2,
                z: (localCenter.z / (rootStore.cubeStore.scaleFactor * ref.current!.scale.z)) + rootStore.reconstructionStore.length / 2
            }
        )
    }, {handedness: 'right'});

    useXREvent('selectend', () => {
        leftSelect = false;
    }, {handedness: 'left'});

    return (
        <>
            <group
                // @ts-ignore
                ref={crop}
            ></group>
            <group
                // @ts-ignore
                ref={controls}
            ></group>
            <group 
                // @ts-ignore
                ref={ref}
                position={[0, 1.5, -1]}
            >
                {children}
            </group>
        </>
    )
};

const CubeControls = observer(CubeControlsView);
export { CubeControls };