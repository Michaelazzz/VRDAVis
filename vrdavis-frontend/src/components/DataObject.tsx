import React, { useEffect, useRef, useState } from 'react';
import { Box, useIntersect } from '@react-three/drei';
import { RayGrab, useController, useInteraction, useXR, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';

import { VolumeShader } from '../shaders/VolumeShader';
import createColormap from 'colormap';


const DataObject = ({data, width, height, depth}: any) => {

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

    // @ts-ignore
    let texture: THREE.Data3DTexture;
    let colormap: THREE.DataTexture;
    let material: THREE.ShaderMaterial;
    let geometry = new THREE.BoxGeometry(1,1,1);
    let dataCube: THREE.Mesh;

    let colourMaps = {
        viridis: new THREE.TextureLoader().load('../colour-maps/cm_viridis.png'),
        // gray: new THREE.TextureLoader().load( 'textures/cm_gray.png', render )
    };

    let cm = createColormap({
        colormap: 'jet',
        nshades: 100,
        format: 'float',
        alpha: 1
    });

    let cmData = new Float32Array(100*4);

    for(let i=0; i<100; i++){
        const stride = i * 4;
        cmData[stride] = cm[i][0];
        cmData[stride+1] = cm[i][1];
        cmData[stride+2] = cm[i][2];
        cmData[stride+3] = cm[i][3];
    }

    useEffect(() => {
        if(!ref.current)
            return;

        // @ts-ignore
        texture = new THREE.Data3DTexture(data, width, height, depth);
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        colormap = new THREE.DataTexture(cmData, 100, 1);
        colormap.type = THREE.FloatType;
        colormap.needsUpdate = true;

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
        // material.map = texture;
        dataCube = new THREE.Mesh(geometry, material);
        dataCube.frustumCulled = false;
        ref.current.add(dataCube);
    },[data]);
    
    useFrame(() => {
        if(!leftController || !rightController) {
            return;
        }

        const leftPos = leftController.controller.position;
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
            // else if(leftSqueeze)
            // {
            //     ref.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0), offsetLeft.x*rotationMultiplier);
            //     ref.current.rotateOnWorldAxis(new THREE.Vector3(1,0,0), -offsetLeft.y*rotationMultiplier);
            // }
            // else if(rightSqueeze)
            // {
            //     ref.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0), offsetRight.x*rotationMultiplier);
            //     ref.current.rotateOnWorldAxis(new THREE.Vector3(1,0,0), -offsetRight.y*rotationMultiplier);
            // }
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
    
    useInteraction(ref, 'onSqueezeStart', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            rightSqueeze = true;
        }

        if(e.controller.inputSource.handedness == 'left'){
            leftSqueeze = true;
        }
    });

    useXREvent('squeezeend', () => {
        rightSqueeze = false;
    }, {handedness: 'right'});

    useXREvent('squeezeend', () => {
        leftSqueeze = false;
    }, {handedness: 'left'});


    useInteraction(ref, 'onSelectStart', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            rightSelect = true;
        }

        if(e.controller.inputSource.handedness == 'left'){
            leftSelect = true;
        }
    });

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
            ref={ref}
            position={[0,1.5,-2.5]}
        >

        </group>
    )
};

export default DataObject;