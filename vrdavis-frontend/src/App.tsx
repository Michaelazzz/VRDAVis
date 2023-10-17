import React, { useContext, useEffect, useState } from "react";
import { XR, Controllers, Interactive, RayGrab, XRButton, VRButton} from "@react-three/xr";
import { Canvas } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from "three";
import CssBaseline from '@mui/material/CssBaseline';
import { ConnectionStatus } from "./stores/backend.store";
import HandMenu from "./components/vr UI/HandMenu";
import WorldspaceMenu from "./components/vr UI/WorldspaceMenu";
import { PairingMenu } from "./components/browser UI/PairingMenu";
import BrowserMenu from "./components/browser UI/BrowserMenu";
import { RootContext } from "./store.context";
import { observer } from "mobx-react";
import { BackendMenu } from "./components/browser UI/BackendMenu";
import { DeviceCredentials } from "./components/browser UI/DeviceCredentials";
import { WebRTCMenu } from "./components/browser UI/WebRTCMenu";
import { FileCredentials } from "./components/browser UI/FileCredentials";
import { DataCube } from "./components/DataCube";
import { CropControls } from "./components/CropControls";
import ExamplePanel from "./components/vr UI/ExamplePanel";
import Panel from "./components/vr UI/Panel";
import HandMenuControls from "./components/vr UI/HandMenuControls";
import Button from "./components/vr UI/Button";
import CropPanel from "./components/vr UI/CropPanel";
import { CubeControls } from "./components/CubeControls";
import { BoundsCube } from "./components/BoundsCube";

const AppView: React.FC = () => {

    // const { signallingStore, backendStore } = useContext(RootContext);
    const { rootStore } = useContext(RootContext);

    useEffect(() => {
        // rootStore.connectToServer('ws://localhost:3002'); // local testing
        rootStore.connectToServer('wss://vrdavis01.idia.ac.za/server');
        rootStore.connectToSignallingServer();
    }, [rootStore]);

    return (
        <>
            <CssBaseline />
            <BrowserMenu>
                <h1>VRDAVis</h1>
                <DeviceCredentials/>
                <WebRTCMenu/>
                <PairingMenu/>
                <BackendMenu/>
                <FileCredentials/>
            </BrowserMenu>
            
            <VRButton />
            <Canvas>
                <XR>
                    {/* <CameraControls/> */}
                    <color 
                        attach="background" 
                        args={["#DBE9EE"]} 
                        // args={["#363537"]}
                    />

                    <ambientLight intensity={0.5} />
                    {/* <pointLight position={[10, 10, 10]} /> */}

                    {/* <mesh
                        position={new THREE.Vector3(0, 0, 0)}
                        rotation={new THREE.Euler(-Math.PI / 2, 0, 0)} 
                    >
                        <planeGeometry attach="geometry" args={[10, 10]} />
                        <meshPhongMaterial attach="material" color="#C0D6DF" />
                    </mesh> */}

                    <Controllers/>
                    {/* <group position={[0,1,-1.5]}></group> */}
                    <HandMenuControls>
                        {/* <ExamplePanel/> */}
                        {/* <Panel text='hello from the UI'/> */}
                        <>
                            <Button 
                                text="crop mode" 
                                position={[0.55, -0.25]}
                                onSelect={() => rootStore.cubeStore.setCropMode(true)}
                            />
                            <Button 
                                text="crop" 
                                position={[0.55, -0.45]}
                                onSelect={rootStore.cropCube}
                            />
                            <CropPanel/>
                        </>
                        
                    </HandMenuControls>
                    {/* <HandMenu /> */}
                    {/* <WorldspaceMenu position={[1,1.5,-1.5]} /> */}
                    
                    {/* { mode==='crop' && <CropControls/>} */}
                     
                    <CubeControls>
                        <DataCube />
                    </CubeControls>
                    
                </XR>
            </Canvas>
        </>
    );
}

const App = observer(AppView);
export default App;