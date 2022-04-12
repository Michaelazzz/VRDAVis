import { Box, useIntersect } from '@react-three/drei';
import { RayGrab, useController, useInteraction, useXR, useXREvent, useXRFrame } from '@react-three/xr';
import { controllers } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from "three";

const ObjectControls = () => {

    const ref = useRef<THREE.Mesh>();

    const [transform, setTransform] = useState(true);
    const [rotate, setRotate] = useState(false);
    const [scale, setScale] = useState(false);

    const [minSize, setMinSize] = useState(0.5)
    const [maxSize, setMaxSize] = useState(2.0)

    const [rightSqueeze, setRightSqueeze] = useState(false);
    const [leftSqueeze, setLeftSqueeze] = useState(false);

    const rightController = useController("right");
    const leftController = useController("left");

    let prevDistance = 0
    const scaleFactor = 0.01

    useXRFrame(() => {
        if(!leftController || !rightController) {
            return;
        }

        const leftPos = leftController.controller.position;
        const rightPos = rightController.controller.position;


        // scale controls
        if(ref.current && leftSqueeze && rightSqueeze)
        {
            const distance = leftPos.distanceTo(rightPos)
            const scale = ref.current.scale
            
            if(distance > prevDistance && scale.x <= maxSize) // scale increases
            {
                ref.current.scale.setX(scale.x + scaleFactor);
                ref.current.scale.setY(scale.y + scaleFactor);
                ref.current.scale.setZ(scale.z + scaleFactor);
            }
            else if(distance < prevDistance && scale.x >= minSize) // scale decreases
            {
                ref.current.scale.setX(scale.x - scaleFactor);
                ref.current.scale.setY(scale.y - scaleFactor);
                ref.current.scale.setZ(scale.z - scaleFactor);
            }

            prevDistance = distance
        }
    });
    
    useInteraction(ref, 'onSelectStart', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSqueeze(true)
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSqueeze(true)
        }
    });

    useInteraction(ref, 'onSelectEnd', (e) => {
        if(e.controller.inputSource.handedness == 'right'){
            setRightSqueeze(false)
        }

        if(e.controller.inputSource.handedness == 'left'){
            setLeftSqueeze(false)
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