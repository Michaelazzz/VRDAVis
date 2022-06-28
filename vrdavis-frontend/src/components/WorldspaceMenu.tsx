import React, { useRef, useState } from 'react'
import { useController, useXRFrame, useInteraction, useXREvent, useXR } from '@react-three/xr';
import * as THREE from "three";
import Panel from './Panel'
import PanelText from './PanelText';
import { Vector3 } from 'three';

const WorldspaceMenu = ({position = [0,0,0]}: any) => {

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

    useXRFrame(() => {
        if(!leftController || !rightController || !ref.current) {
            return;
        }
        
        const leftPos = leftController.controller.position;
        const rightPos = rightController.controller.position;

        if(prevLeftPos && prevRightPos) {
           
            let offsetLeft = leftPos.clone().sub(prevLeftPos);
            let offsetRight = rightPos.clone().sub(prevRightPos);
            
            // translation controls
            if(leftSelect){
                // if((ref.current.position.x >= xRange[0] || ref.current.position.x <= xRange[1]) && (ref.current.position.y >= yRange[0] || ref.current.position.y <= yRange[1]))
                    ref.current.position.add(offsetLeft.multiplyScalar(movementMultiplier));
            }
            else if(rightSelect){
                // if(ref.current.position.x >= xRange[0] || ref.current.position.x <= xRange[1])
                    ref.current.position.add(offsetRight.multiplyScalar(movementMultiplier));
            }

            prevRightPos = rightPos.clone();
            prevLeftPos = leftPos.clone();
        }

        ref.current.lookAt(player.position);
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
        <group ref={ref} position={ position }>
            <Panel 
                height={1}
            >
                <PanelText>
                    Worldspace Menu
                </PanelText>
                
            </Panel>
        </group>
    )
}

export default WorldspaceMenu