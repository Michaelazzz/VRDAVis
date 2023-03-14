import React, { useContext, useEffect, useState } from "react";
import { XR, Controllers, Interactive, RayGrab, XRButton, VRButton} from "@react-three/xr";
import { Canvas } from '@react-three/fiber'
// import {Box, Plane} from "@react-three/drei";
import * as THREE from "three";
import CssBaseline from '@mui/material/CssBaseline';
import HandMenu from "./components/HandMenu";
import DataObject from "./components/DataObject";
import WorldspaceMenu from "./components/WorldspaceMenu";
import { PairingMenu } from "./components/browser UI/PairingMenu";
import BrowserMenu from "./components/browser UI/BrowserMenu";
import { RootContext } from "./store.context";
import { observer } from "mobx-react";
import { BackendMenu } from "./components/browser UI/BackendMenu";
import { DeviceCredentials } from "./components/browser UI/DeviceCredentials";
import { WebRTCMenu } from "./components/browser UI/WebRTCMenu";

const AppView: React.FC = () => {

    const { signallingStore, backendStore } = useContext(RootContext);

    useEffect(() => {
        // appStore.initVRDAVis();
        signallingStore.start();
        // backendStore.start();
    }, [signallingStore, backendStore]);

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
                <DeviceCredentials/>
                <WebRTCMenu/>
                <PairingMenu/>
                <BackendMenu/>
            </BrowserMenu>
            
            <VRButton />
            <Canvas>
                <XR>
                    <color 
                        attach="background" 
                        args={["#DBE9EE"]} 
                    />

                    <ambientLight intensity={0.5} />
                    {/* <pointLight position={[10, 10, 10]} /> */}

                    <mesh
                        position={new THREE.Vector3(0, 0, 0)}
                        rotation={new THREE.Euler(-Math.PI / 2, 0, 0)} 
                    >
                        <planeGeometry attach="geometry" args={[10, 10]} />
                        <meshPhongMaterial attach="material" color="C0D6DF" />
                    </mesh>

                    <Controllers />

                    {/* <HandMenu /> */}

                    {/* <WorldspaceMenu position={[1,1.5,-1.5]} /> */}
                    

                    <DataObject data={data} height={height} width={width} depth={depth} />
                </XR>
            </Canvas>
        </>
    );
}

const App = observer(AppView);
export default App;