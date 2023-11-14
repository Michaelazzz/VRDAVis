import React, { useRef, useState } from 'react'
import { useController, useXREvent, useXR } from '@react-three/xr';
import * as THREE from "three";
import Panel from './ExamplePanel'
import PanelText from './PanelText';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

const WorldspaceMenu = ({position = [0,0,0], children}: any) => {

    const ref = useRef<THREE.Mesh>();

    const { player } = useXR();

    const [xRange] = useState([-2, 2]);
    const [yRange] = useState([0, 2]);

    let rightSqueeze = false;
    let leftSqueeze = false;

    let rightSelect = false;
    let leftSelect = false;

    const rightController = useController("right");
    const leftController = useController("left");

    const movementMultiplier = 5;

    let prevRightPos = rightController?.controller.position;
    let prevLeftPos = leftController?.controller.position;

    useFrame(() => {
        if(!leftController || !rightController || !ref.current) {
            return;
        }
        
        const leftPos = leftController.controller.position;
        const rightPos = rightController.controller.position;

        if(prevLeftPos && prevRightPos) {
           
            let offsetLeft = leftPos.clone().sub(prevLeftPos);
            let offsetRight = rightPos.clone().sub(prevRightPos);
            
            // translation controls
            if(leftSqueeze){
                if((ref.current.position.x >= xRange[0] || ref.current.position.x <= xRange[1]) && (ref.current.position.y >= yRange[0] || ref.current.position.y <= yRange[1]))
                    ref.current.position.add(offsetLeft.multiplyScalar(movementMultiplier));
            }
            else if(rightSqueeze){
                if(ref.current.position.x >= xRange[0] || ref.current.position.x <= xRange[1])
                    ref.current.position.add(offsetRight.multiplyScalar(movementMultiplier));
            }

            prevRightPos = rightPos.clone();
            prevLeftPos = leftPos.clone();
        }

        ref.current.lookAt(player.position.y, ref.current.position.y, player.position.z);
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
        // @ts-ignore
        <group ref={ref} position={ position }>
            {children}
        </group>
    )
}

export default WorldspaceMenu