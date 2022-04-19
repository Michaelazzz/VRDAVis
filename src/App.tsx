import React from "react";
import {VRCanvas, DefaultXRControllers, Interactive, RayGrab} from "@react-three/xr";
import {Box, Plane} from "@react-three/drei";
import * as THREE from "three";

import HandMenu from "./components/HandMenu";
import DataObject from "./components/DataObject";
import WorldspaceMenu from "./components/WorldspaceMenu";

function App() {
    return (
        <>
            <VRCanvas>
                <color 
                    attach="background" 
                    args={["#DBE9EE"]} 
                />
                
                <Plane 
                    position={[0, 0, 0]} 
                    rotation={[Math.PI / 2, 0, 0]} 
                    scale={[10, 10, 10]}
                >
                    <meshBasicMaterial color="#C0D6DF" side={THREE.DoubleSide} />
                </Plane>

                <DefaultXRControllers />

                <HandMenu />

                <RayGrab>
                    <WorldspaceMenu position={[1,1.5,-1.5]} />
                </RayGrab>
                

                <DataObject/>
                
            </VRCanvas>
        </>
    );
}

export default App;
