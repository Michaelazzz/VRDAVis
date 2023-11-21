import React, { useRef, useEffect, useMemo, useState } from 'react';
import { observer } from "mobx-react";

import * as THREE from "three";
import { useInteraction } from '@react-three/xr';

const ButtonPanelView: React.FC<{position?: number[], text?: string, onSelect?: Function, toggleOn?: boolean}> = ({position=[0,0,0], text='', onSelect = () => {}, toggleOn = false}) => {
    const ref = useRef<THREE.Mesh>();
    const backgroundRef = useRef<THREE.Mesh>();

    const [hover, setHover] = useState(false);
    const [selected, setSelected] = useState(false);
    const [toggle, setToggle] = useState(false);

    const handleToggle = (toggle: boolean) => {
        setToggle(toggle);
        setColour((toggle) ? '#FF0000' : '#000000');
    }

    const handleHover = (toggle: boolean) => {
        setHover(toggle);
        setColour((toggle) ? '#5A5A5A' : '#000000');
    }

    const [colour, setColour] = useState('#000000');

    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 200;
    const context = canvas.getContext('2d');

    context!.font = '50px sans-serif';
    context!.fillStyle = '#FFFFFF';
    context!.fillText(`${text}`, 55, 110);

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
    texture.needsUpdate = true;

    const geometry = useMemo(() => new THREE.PlaneGeometry(0.5, 0.25), []);
    const material = useMemo(() => new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.99,
        side: THREE.DoubleSide,
        alphaTest: 0.1
    }), [texture]);

    const mesh = useMemo(() => new THREE.Mesh(geometry, material), [geometry, material]);

    var background = document.createElement("canvas");
    background.width = 400;
    background.height = 200;
    const contextBackground = background.getContext('2d');

    contextBackground!.fillStyle = colour;
    contextBackground!.fillRect(90, 0, 200, 400);

    const textureBackground = useMemo(() => new THREE.CanvasTexture(background), [background]);
    textureBackground.needsUpdate = true;

    const geometryBackground = useMemo(() => new THREE.PlaneGeometry(1, 0.2), []);
    const materialBackground = useMemo(() => new THREE.MeshBasicMaterial({
        map: textureBackground,
        transparent: true,
        opacity: 0.99,
        side: THREE.DoubleSide,
        alphaTest: 0.1
    }), [textureBackground]);

    const meshBackground = useMemo(() => new THREE.Mesh(geometryBackground, materialBackground), [geometryBackground, materialBackground]);

    useEffect(() => {
        if(!ref.current || !backgroundRef.current) return;
        ref.current.clear(); 
        ref.current.add(mesh);
        backgroundRef.current.clear();
        backgroundRef.current.add(meshBackground);
        if(material.map) material.map.needsUpdate = true;
        if(materialBackground.map) materialBackground.map.needsUpdate = true;
    },[mesh, material, colour, materialBackground, meshBackground]);

    // @ts-ignore
    useInteraction(ref, 'onSelectStart', () => {
        setSelected(true);
        if(toggleOn) {
            handleToggle(!toggle)
        }
        
        // buttonRef.current.position.z -= 0.035;
        onSelect();
    });
    // @ts-ignore
    useInteraction(backgroundRef, 'onSelectStart', () => {
        setSelected(true);
        if(toggleOn) {
            handleToggle(!toggle)
        }
        
        // buttonRef.current.position.z -= 0.035;
        onSelect();
    });
    // @ts-ignore
    useInteraction(backgroundRef, 'onHover', () => {
        handleHover(!hover);
    });
    // @ts-ignore
    useInteraction(backgroundRef, 'onBlur', () => {
        handleHover(!hover);
    });

    return(
        <>
            <group 
                // @ts-ignore
                ref={ref}
                position={[position[0], position[1], position[2]]}
            ></group>
            <group 
                // @ts-ignore
                ref={backgroundRef}
                position={[position[0], position[1], position[2]-0.025]}
            ></group>
        </>
    )
}

const ButtonPanel = observer(ButtonPanelView);
export { ButtonPanel };