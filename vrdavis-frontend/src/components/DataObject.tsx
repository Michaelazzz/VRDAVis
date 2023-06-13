import React, { useContext, useEffect, useRef, useState } from 'react';
import { RayGrab, XRInteractionEvent, useController, useInteraction, useXR, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';

import { VolumeShader } from '../shaders/VolumeShader';
import createColormap from 'colormap';
import { RootContext } from '../store.context';
import { observer } from 'mobx-react';

const DataObjectView: React.FC = () => {

    const { backendStore } = useContext(RootContext);
    const data = backendStore.volumeData;
    const width = backendStore.width;
    const height = backendStore.height;
    const depth = backendStore.depth;

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

    let cmData = new Float32Array(100*4);

    let cm = createColormap({
        colormap: 'jet',
        nshades: 100,
        format: 'float',
        alpha: 1
    });

    for(let i=0; i<100; i++){
        const stride = i * 4;
        cmData[stride] = cm[i][0];
        cmData[stride+1] = cm[i][1];
        cmData[stride+2] = cm[i][2];
        cmData[stride+3] = cm[i][3];
    }

    // @ts-ignore
    let texture: THREE.Data3DTexture;
    texture = new THREE.Data3DTexture(data, width, height, depth);
    let colormap: THREE.DataTexture;
    colormap = new THREE.DataTexture(cmData, 100, 1);
    let material: THREE.ShaderMaterial;
    material = new THREE.ShaderMaterial({
        uniforms: {
            u_textureData: { value: texture },
            // u_threshold: { value: 0.25 },
            // u_range: { value: 0.1 },
            // u_steps: { value: 100 },
            u_colourMap: { value: colormap },
        },
        vertexShader: VolumeShader.vertexShader,
        fragmentShader: VolumeShader.fradgmentShader,
        side: THREE.BackSide,
        transparent: true
    });
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let dataCube: THREE.Mesh;
    dataCube = new THREE.Mesh(geometry, material);

    useEffect(() => {
        if(!ref.current)
            return;

        // @ts-ignore
        
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        colormap.type = THREE.FloatType;
        colormap.needsUpdate = true;
        
        // material.map = texture;
        
        dataCube.frustumCulled = false;
        ref.current.add(dataCube);
    }, [colormap, dataCube, texture]);
    

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
        // <Box 
        //     castShadow
        //     receiveShadow
        //     ref={ref} 
        //     position={[0,1.5,-2.5]}
        // >
        //     <meshPhongMaterial attach='material' color={new THREE.Color(0xf92a82)} />
        // </Box>
        // <mesh
        //     ref={ref}
        //     position={[0,1.5,-2.5]}
        // >
        //     <boxGeometry args={[1, 1, 1]} />
        //     <meshBasicMaterial color={'hotpink'} />
        // </mesh>
        <group 
            // @ts-ignore
            ref={ref}
            position={[0,1.5,-2.5]}
        ></group>
    )
};

const DataObject = observer(DataObjectView);
export { DataObject };