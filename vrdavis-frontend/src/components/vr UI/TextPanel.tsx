import React, { useRef, useEffect, useMemo } from 'react';
import { observer } from "mobx-react";

import * as THREE from "three";

const TextPanelView: React.FC<{position?: number[], text?: string, width?: number}> = ({position=[0,0,0], text='text', width=1}) => {
    const ref = useRef<THREE.Mesh>();

    var canvas = document.createElement("canvas");
    canvas.width = 500*width;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context!.font = '40px sans-serif';
    context!.fillStyle = '#FFFFFF';
    context!.fillText(`${text}`, 40, 60);

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
    texture.needsUpdate = true;

    const geometry = useMemo(() => new THREE.PlaneGeometry(width, 0.2), [width]);
    const material = useMemo(() => new THREE.MeshBasicMaterial({
        map: texture
    }), [texture]);

    const mesh = useMemo(() => new THREE.Mesh(geometry, material), [geometry, material]);

    useEffect(() => {
        if(!ref.current) return;
        ref.current.clear(); 
        ref.current.add(mesh);
        if(material.map) material.map.needsUpdate = true;
    },[mesh, material]);

    return(
        <group 
            // @ts-ignore
            ref={ref}
            position={[position[0], position[1], position[2]]}
        ></group>
    )
}

const TextPanel = observer(TextPanelView);
export { TextPanel };