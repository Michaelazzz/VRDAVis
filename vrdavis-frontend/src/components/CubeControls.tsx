import React, { useRef, useState, PropsWithChildren, useMemo, useContext, useEffect } from 'react';
import { useController, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';
import { observer } from 'mobx-react';
import { RootContext } from '../store.context';

const CubeControlsView: React.FC<PropsWithChildren> = ({children}) => {
    const { rootStore } = useContext(RootContext);
    
    const ref = useRef<THREE.Mesh>();
    const crop = useRef<THREE.Mesh>();

    const [width, setWidth] = useState(0.01);
    const [length, setLength] = useState(0.01);
    const [height, setHeight] = useState(0.01);

    const [minSize] = useState(0.5);
    const [maxSize] = useState(2.0);

    let rightSqueeze = false;
    let leftSqueeze = false;

    let rightSelect = false;
    let leftSelect = false;

    const rightController = useController("right");
    const leftController = useController("left");

    let prevDistance = 0;
    const scaleFactor = 0.01;
    const rotationMultiplier = 5;
    const movementMultiplier = 5;

    let prevRightPos = rightController?.controller.position;
    let prevLeftPos = leftController?.controller.position;

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
            // mesh.current!.position.set(
            //     controller!.controller.position.x + offset[0], 
            //     controller!.controller.position.y + offset[1], 
            //     controller!.controller.position.z + offset[2]
            // );
        } else {
            // scale controls
            if(ref.current && leftSqueeze && rightSqueeze) {
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

            if(ref.current && (prevLeftPos && prevRightPos)) {
                let offsetLeft = leftPos.clone().sub(prevLeftPos);
                let offsetRight = rightPos.clone().sub(prevRightPos);

                if(leftSelect && rightSelect)
                {
                    // rotation controls
                    ref.current.rotateOnAxis(new THREE.Vector3(0,1,0), offsetLeft.x*rotationMultiplier);
                    ref.current.rotateOnAxis(new THREE.Vector3(1,0,0), -offsetLeft.y*rotationMultiplier);
                }
                else if(leftSqueeze)
                {
                    ref.current.rotateOnAxis(new THREE.Vector3(0,1,0), offsetLeft.x*rotationMultiplier);
                    ref.current.rotateOnAxis(new THREE.Vector3(1,0,0), -offsetLeft.y*rotationMultiplier);
                }
                else if(rightSqueeze)
                {
                    // ref.current.rotation.y += offsetRight.x*rotationMultiplier / 100;
                    // ref.current.rotation.x += -offsetRight.x*rotationMultiplier / 100;
                    ref.current.rotateOnAxis(new THREE.Vector3(0,1,0), offsetRight.x*rotationMultiplier);
                    ref.current.rotateOnAxis(new THREE.Vector3(1,0,0), -offsetRight.y*rotationMultiplier);
                }
                else if(leftSelect) // translation controls
                {
                    ref.current.position.add(offsetLeft.multiplyScalar(movementMultiplier));
                }
                else if(rightSelect)
                {
                    ref.current.position.add(offsetRight.multiplyScalar(movementMultiplier));
                }

                prevRightPos = rightPos.clone();
                prevLeftPos = leftPos.clone();
            }
        }

    });

    useXREvent('squeezestart', () => {
        rightSqueeze = true;
    }, {handedness: 'right'});

    useXREvent('squeezestart', () => {
        leftSqueeze = true;
    }, {handedness: 'left'});

    useXREvent('squeezeend', () => {
        rightSqueeze = false;
    }, {handedness: 'right'});

    useXREvent('squeezeend', () => {
        leftSqueeze = false;
    }, {handedness: 'left'});

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
        // console.log(`${Math.abs(crop.current!.scale.x) / rootStore.fileStore.fileWidth} ${Math.abs(crop.current!.scale.y) / rootStore.fileStore.fileHeight} ${Math.abs(crop.current!.scale.z) / rootStore.fileStore.fileLength}`)
        // console.log(`${crop.current?.position.x} ${crop.current?.position.y} ${crop.current?.position.z}`)
        rootStore.cubeStore.setCubeDims(
            {
                x: Math.abs(crop.current!.scale.x) / rootStore.fileStore.fileWidth,
                y: Math.abs(crop.current!.scale.y) / rootStore.fileStore.fileHeight,
                z: Math.abs(crop.current!.scale.z) / rootStore.fileStore.fileLength
            },
            {
                x: crop.current!.position.x,
                y: crop.current!.position.y,
                z: crop.current!.position.z
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
                ref={ref}
                position={[0,1.5,-1.5]}
                // position={[0,0,0]}
            >
                {children}
            </group>
        </>
    )
};

const CubeControls = observer(CubeControlsView);
export { CubeControls };