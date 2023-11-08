import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useController, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';

import { VolumeShader } from '../shaders/VolumeShader';
import createColormap from 'colormap';
import { RootContext } from '../store.context';
import { observer } from 'mobx-react';

const DataObjectView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    // const backendStore = rootStore.backendStore;
    const reconstructionStore = rootStore.reconstructionStore;
    const data = reconstructionStore.data;
    const width = reconstructionStore.width;
    const height = reconstructionStore.height;
    const length = reconstructionStore.length;

    const ref = useRef<THREE.Mesh>();

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

    let cmData = useMemo(() => {
        const cmArray = new Float32Array(100*4);
        let cm = createColormap({
            colormap: 'jet',
            nshades: 100,
            format: 'float',
            alpha: 1
        });
        for(let i=0; i<100; i++){
            const stride = i * 4;
            cmArray[stride] = cm[i][0];
            cmArray[stride+1] = cm[i][1];
            cmArray[stride+2] = cm[i][2];
            cmArray[stride+3] = cm[i][3];
        }
        return cmArray;
    }, []);

    let geometry = useMemo(() => new THREE.BoxGeometry(width, height, length), [width, length, height]);

    // @ts-ignore
    let texture: THREE.Data3DTexture = useMemo(() => {
        console.log('texture updated')
        return new THREE.Data3DTexture(data, width, height, length)
    }, [data, width, height, length]);
    texture.format = THREE.RedFormat;
    texture.type = THREE.FloatType;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    let colormap: THREE.DataTexture = useMemo(() => 
        new THREE.DataTexture(cmData, 100, 1)
    , [cmData]);
    colormap.type = THREE.FloatType;
    colormap.needsUpdate = true;
    
    let material: THREE.ShaderMaterial = useMemo(() => { 
        console.log('material updated')
        return new THREE.ShaderMaterial({
            uniforms: {
                u_textureData: { value: texture },
                // u_threshold: { value: 0.25 },
                // u_range: { value: 0.1 },
                // u_steps: { value: 100 },
                u_colourMap: { value: colormap },
                // map: { value: texture },
                // cameraPos: { value: new THREE.Vector3() }
            },
            vertexShader: VolumeShader.vertexShader,
            fragmentShader: VolumeShader.fradgmentShader,
            side: THREE.BackSide,
            transparent: true
        })
    }, [colormap, texture]);

    let dataCube: THREE.Mesh = useMemo(() => 
        new THREE.Mesh(geometry, material), 
    [geometry, material]);
    dataCube.frustumCulled = false;

    useEffect(() => {
        if(!ref.current)
            return;
        ref.current.add(dataCube);
        
    }, [dataCube]);
    

    useFrame(() => {
        if(!leftController || !rightController) {
            return;
        }

        const leftPos = leftController.controller.position
        const rightPos = rightController.controller.position;
        
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
                ref.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0), offsetLeft.x*rotationMultiplier);
                ref.current.rotateOnWorldAxis(new THREE.Vector3(1,0,0), -offsetLeft.y*rotationMultiplier);
            }
            else if(leftSqueeze)
            {
                ref.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0), offsetLeft.x*rotationMultiplier);
                ref.current.rotateOnWorldAxis(new THREE.Vector3(1,0,0), -offsetLeft.y*rotationMultiplier);
            }
            else if(rightSqueeze)
            {
                ref.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0), offsetRight.x*rotationMultiplier);
                ref.current.rotateOnWorldAxis(new THREE.Vector3(1,0,0), -offsetRight.y*rotationMultiplier);
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
    }, {handedness: 'right'});

    useXREvent('selectstart', () => {
        leftSelect = true;
    }, {handedness: 'left'});

    useXREvent('selectend', () => { 
        rightSelect = false; 
    }, {handedness: 'right'});

    useXREvent('selectend', () => {
        leftSelect = false;
    }, {handedness: 'left'});

    return (
        <group 
            // @ts-ignore
            ref={ref}
            position={[0,1.5,-2.5]}
        ></group>
    )
};

const DataObject = observer(DataObjectView);
export { DataObject };