import { useEffect, useRef } from "react";
import { useController } from "@react-three/xr";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const HandMenuControls = ({children, ...rest}: any) => {
    const ref = useRef<THREE.Mesh>(); // reference for hand mounted menu
    const leftController = useController("left");

    useEffect(() => {
        if(!ref.current)
            return;
    }, [])

    useFrame(state => {
        if (!leftController) {
            return;
        }
        const controller = leftController.controller;
        const x = 0;
        const y = 0.6;
        const z = -0.5;
        const offset = new THREE.Vector3(-controller.position.x + x, -controller.position.y + y, -controller.position.z + z);
        if (ref.current) {
            ref.current.position.copy(controller.position).add(offset);
            leftController.controller.add(ref.current);
        }
    });

    return (
        <group ref={ref} {...rest}>
            {children}
        </group>
    );
}

export default HandMenuControls;