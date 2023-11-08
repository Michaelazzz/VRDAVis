import React, { useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react";
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';
import { Sphere } from "./Sphere";

const CropCubeView: React.FC<{dims: number[]}> = ({dims}) => {
    const mesh = useRef<THREE.Mesh>();

    const geometryCube = useMemo(() => new THREE.BoxGeometry( dims[0], dims[1], dims[2] ), [dims]);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry( geometryCube ), [geometryCube]);
    const materialCube = useMemo(() => new THREE.LineBasicMaterial({
        color: 0x00FF00,
        fog: false,
        linewidth: 1, // 1 regardless of set value
        linecap: 'round',
        linejoin: 'round'
    }), []);

    const edges = useMemo(() => new THREE.LineSegments( edgesGeometry, materialCube ), [edgesGeometry, materialCube]);

    useEffect(() => {
        if(!mesh.current)
            return;
            mesh.current.add(edges);
    }, [edges]);

    useFrame(() => {

    });

    return (
        <mesh 
            // @ts-ignore
            ref={mesh}
        >
            {/* <Sphere position={[-0.5, -0.5, -0.5]} size={0.05} />
            <Sphere position={[0.5, -0.5, -0.5]} size={0.05} />
            <Sphere position={[-0.5, 0.5, -0.5]} size={0.05} />
            <Sphere position={[0.5, 0.5, -0.5]} size={0.05} />
            <Sphere position={[-0.5, -0.5, 0.5]} size={0.05} />
            <Sphere position={[0.5, -0.5, 0.5]} size={0.05} />
            <Sphere position={[-0.5, 0.5, 0.5]} size={0.05} />
            <Sphere position={[0.5, 0.5, 0.5]} size={0.05} /> */}
        </mesh>
    )
}

const CropCube = observer(CropCubeView);
export { CropCube };