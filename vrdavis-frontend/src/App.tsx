import React, { useContext, useEffect, useState } from "react";
import {VRCanvas, DefaultXRControllers, Interactive, RayGrab} from "@react-three/xr";
import {Box, Plane} from "@react-three/drei";
import * as THREE from "three";
import CssBaseline from '@mui/material/CssBaseline';

import HandMenu from "./components/HandMenu";
import DataObject from "./components/DataObject";
import WorldspaceMenu from "./components/WorldspaceMenu";
import { PairingMenu } from "./components/PairingMenu";
import BrowserMenu from "./components/BrowserMenu";
import { RootContext } from "./store.context";
import { observer } from "mobx-react";

const AppView: React.FC = () => {

    const { signallingStore } = useContext(RootContext);
    const paired = signallingStore.getPaired();
    const pairedDeviceId = signallingStore.getPairedDeviceId();

    useEffect(() => {
        signallingStore.start();
    }, []);

    let height = 128;
    let width = 128;
    let depth = 128;

    let size = height*width*depth;
    let data = new Float32Array(size);

    for(let i = 0; i < size; i++)
    {
        data[i] = Math.random();
    }

    return (
        <>
            <CssBaseline />
            <BrowserMenu>
                <h1>VRDAVis</h1>
                {!paired && <PairingMenu />}
                {paired && 
                    <>
                        <p>This device is paired to:</p>
                        <p>{pairedDeviceId}</p>
                    </>
                }
            </BrowserMenu>
            
            <VRCanvas>
                <color 
                    attach="background" 
                    args={["#DBE9EE"]} 
                />

                <ambientLight intensity={1} />
                {/* <pointLight position={[10, 10, 10]} /> */}
                
                <Plane 
                    
                    position={[0, 0, 0]} 
                    rotation={[Math.PI / 2, 0, 0]} 
                    scale={[10, 10, 10]}
                >
                    <meshStandardMaterial color="#C0D6DF" side={THREE.DoubleSide} />
                </Plane>

                <DefaultXRControllers />

                {/* <HandMenu /> */}

                {/* <WorldspaceMenu position={[1,1.5,-1.5]} /> */}
                

                <DataObject data={data} height={height} width={width} depth={depth} />
                
            </VRCanvas>
        </>
    );
}

const App = observer(AppView);
export default App;
