import { Box, useIntersect } from '@react-three/drei';
import { RayGrab, useController, useInteraction, useXR, useXREvent, useXRFrame } from '@react-three/xr';
import { controllers } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from "three";

const ObjectControls = () => {

    const ref = useRef<THREE.Mesh>();

    const [minSize, setMinSize] = useState(0.5);
    const [maxSize, setMaxSize] = useState(2.0);

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

    useXRFrame(() => {
        
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
                ref.current.rotateY(offsetLeft.x*rotationMultiplier);
                ref.current.rotateX(-offsetLeft.y*rotationMultiplier);
            }
            else if(leftSelect || rightSelect)
            {
                // translation controls
        
                if(leftSelect){
                    ref.current.position.add(offsetLeft.multiplyScalar(movementMultiplier));
                }

                if(rightSelect){
                    ref.current.position.add(offsetRight.multiplyScalar(movementMultiplier));
                }
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
        <Box 
            ref={ref} 
            position={[0,1.5,-2.5]}
        >
            <meshBasicMaterial attach='material' color={new THREE.Color(0xf92a82)} />
        </Box>
    )
};

export default ObjectControls;