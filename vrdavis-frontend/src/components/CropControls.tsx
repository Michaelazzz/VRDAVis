import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';
import { useController, useXREvent } from "@react-three/xr";
import { Sphere } from "./Sphere";

const CropControlsView: React.FC<PropsWithChildren> = ({children}) => {
    const mesh = useRef<THREE.Mesh>();

    const [width, setWidth] = useState(0.01);
    const [length, setLength] = useState(0.01);
    const [height, setHeight] = useState(0.01);

    const [selected, setSelected] = useState(false);

    const [distance, setDistance] = useState(new THREE.Vector3());
    let scaleFactor = 220;
    let offset = useMemo(() => [0,0,0], [])

    const controller = useController("right");

    const sphereGeometry = useMemo(() => new THREE.SphereGeometry( 0.05, 32, 16 ), []); 
    const sphereMaterial = useMemo(() => new THREE.MeshBasicMaterial( { color: 0xffff00 } ), []); 
    const sphere = useMemo(() => new THREE.Mesh( sphereGeometry, sphereMaterial), [sphereGeometry, sphereMaterial]);

    const geometryCube = useMemo(() => new THREE.BoxGeometry( width, length, height ), [width, height, length]);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry( geometryCube ), [geometryCube]);
    const materialCube = useMemo(() => new THREE.LineBasicMaterial({
        color: 0x000000,
        fog: false,
        linewidth: 1, // 1 regardless of set value
        linecap: 'round',
        linejoin: 'round'
    }), []);

    const edges = useMemo(() => new THREE.LineSegments( edgesGeometry, materialCube ), [edgesGeometry, materialCube]);

    useEffect(() => {
        if(!controller) return;
        mesh.current!.add(edges);
        mesh.current!.position.set(
            controller!.controller.position.x + offset[0], 
            controller!.controller.position.y - offset[1], 
            controller!.controller.position.z + offset[2]
        );
    }, [edges, controller, offset]);

    useFrame(() => {
        if(selected) {
            // track the contollers position and the distance it is from the spawn point
            setDistance(controller!.controller.position.sub(mesh.current!.position));
            mesh.current!.scale.set(distance.x * scaleFactor, distance.y * scaleFactor, distance.z * scaleFactor);
            offset[0] = mesh.current!.scale.x/2;
            offset[1] = mesh.current!.scale.y/2;
            offset[2] = mesh.current!.scale.z/2;
            // mesh.current!.position.set(
            //     controller!.controller.position.x + offset[0], 
            //     controller!.controller.position.y + offset[1], 
            //     controller!.controller.position.z + offset[2]
            // );
        }
    });

    useXREvent('squeezestart', () => {
        setSelected(true);
        mesh.current!.position.set(controller!.controller.position.x, controller!.controller.position.y, controller!.controller.position.z);
    }, {handedness: 'right'});

    useXREvent('squeezeend', () => {
        setSelected(false);
    }, {handedness: 'right'});

    return (
        <group 
            // @ts-ignore
            ref={mesh}
        >
            {children}
        </group>
    )
}

const CropControls = observer(CropControlsView);
export { CropControls };