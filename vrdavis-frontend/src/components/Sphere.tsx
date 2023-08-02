import React, { useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react";

import * as THREE from 'three';

const SphereView: React.FC<{position: number[], size: number}> = ({position, size}) => {
    const mesh = useRef<THREE.Mesh>();
    const geometry = useMemo(() => new THREE.SphereGeometry( size, 32, 16 ), [size]); 
    const material = useMemo(() => new THREE.MeshBasicMaterial( { color: 0xffff00 } ), []); 
    const sphere = useMemo(() => new THREE.Mesh( geometry, material), [geometry, material]);

    useEffect(() => {
        if(!mesh.current)
            return;
            mesh.current.add(sphere)
    }, [sphere]);

    return (
        <mesh 
            // @ts-ignore
            ref={mesh}
            position={[position[0], position[1], position[2]]}
        ></mesh>
    )
}

const Sphere = observer(SphereView);
export { Sphere };