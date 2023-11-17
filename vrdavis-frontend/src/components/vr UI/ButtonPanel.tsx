import React, { useRef, useEffect, useMemo, useState } from 'react';
import { observer } from "mobx-react";

import * as THREE from "three";
import { useInteraction } from '@react-three/xr';

const ButtonPanelView: React.FC<{position?: number[], text?: string, onSelect?: Function, toggleOn?: boolean}> = ({position=[0,0,0], text='', onSelect = () => {}, toggleOn = false}) => {
    const ref = useRef<THREE.Mesh>();

    const [hover, setHover] = useState(false);
    const [selected, setSelected] = useState(false);
    const [toggle, setToggle] = useState(false);

    const [colour, setColour] = useState('#FFFFFF');

    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 200;
    const context = canvas.getContext('2d');

    context!.font = '50px sans-serif';
    context!.fillStyle = colour;
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

    useEffect(() => {
        if(!ref.current) return;
        ref.current.clear(); 
        ref.current.add(mesh);
        if(material.map) material.map.needsUpdate = true;
    },[mesh, material, colour]);

    // @ts-ignore
    useInteraction(ref, 'onSelectStart', () => {
        // setSelected(true);
        setToggle(!toggle);
        setColour((toggle) ? '#FF0000' : '#FFFFFF');
        // buttonRef.current.position.z -= 0.035;
        onSelect();
    });
    // useInteraction(buttonRef, 'onSelectEnd', () => {
    //     setSelected(false);
    //     buttonRef.current.position.z += 0.035;
    // });
    // useInteraction(buttonRef, "onHover", () => {
    //     setHover(true);
    // });
    // useInteraction(buttonRef, "onBlur", () => {
    //     setHover(false);
    // });

    return(
        <group 
            // @ts-ignore
            ref={ref}
            position={[position[0], position[1], position[2]]}
        ></group>
    )
}

const ButtonPanel = observer(ButtonPanelView);
export { ButtonPanel };