import { Box, useIntersect } from '@react-three/drei';
import { RayGrab, useController, useInteraction, useXR, useXREvent, useXRFrame } from '@react-three/xr';
import { controllers } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from "three";

const ObjectControls = () => {

    const ref = useRef<THREE.Mesh>();

    const [minSize, setMinSize] = useState(0.5);
    const [maxSize, setMaxSize] = useState(2.0);

    const [rightSqueeze, setRightSqueeze] = useState(false);
    const [leftSqueeze, setLeftSqueeze] = useState(false);

    const [rightSelect, setRightSelect] = useState(false);
    const [leftSelect, setLeftSelect] = useState(false);

    const rightController = useController("right");
    const leftController = useController("left");

    let prevDistance = 0;
    const scaleFactor = 0.01;

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

                ref.current.rotateY(offsetLeft.x);
                ref.current.rotateX(-offsetLeft.y);
            }
            else if(leftSelect || rightSelect)
            {
                // translation controls
        
                if(leftSelect){
                    ref.current.position.add(offsetLeft);
                }

                if(rightSelect){
                    ref.current.position.add(offsetRight);
                }
            }

            prevRightPos = rightPos.clone();
            prevLeftPos = leftPos.clone();
        }
    });
    
    useInteraction(ref, 'onSqueezeStart', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSqueeze(true);
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSqueeze(true);
        }
    });

    useInteraction(ref, 'onSqueezeEnd', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSqueeze(false);
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSqueeze(false);
        }
    });


    useInteraction(ref, 'onSelectStart', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSelect(true);
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSelect(true);
        }
    });

    useInteraction(ref, 'onSelectEnd', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSelect(false);
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSelect(false);
        }
    });
    

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