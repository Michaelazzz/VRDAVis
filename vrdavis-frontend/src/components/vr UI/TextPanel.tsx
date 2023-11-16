import React, { useRef, useEffect, useMemo, useContext } from 'react';
import { observer } from "mobx-react";

import * as THREE from "three";
import { RootContext } from '../../store.context';

const TextPanelView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    const ref = useRef<THREE.Mesh>();

    var canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');

    context!.font = '15px sans-serif';
    context!.fillStyle = '#FFFFFF';
    context!.fillText(`framerate ${rootStore.cubeStore.fps}`, 10, 20);
    // context!.fillRect( 0, 0, 100, 100 );

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
    texture.needsUpdate = true;

    const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
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
        ></group>
    )
}

const TextPanel = observer(TextPanelView);
export { TextPanel };