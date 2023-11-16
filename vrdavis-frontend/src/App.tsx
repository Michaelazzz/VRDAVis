import React, { useContext, useEffect } from "react";
import { XR, Controllers, VRButton} from "@react-three/xr";
import { Canvas } from '@react-three/fiber';
import { Bvh, PerformanceMonitor } from '@react-three/drei'
import CssBaseline from '@mui/material/CssBaseline';
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
import HandMenuControls from "./components/vr UI/HandMenuControls";
import { CubeControls } from "./components/CubeControls";
import { TextPanel } from "./components/vr UI/TextPanel";

const AppView: React.FC = () => {

    // const { signallingStore, backendStore } = useContext(RootContext);
    const { rootStore } = useContext(RootContext);

    // const [minimize, setMinimize] = useState(false);
    // const toggleHandMenu = () => { (minimize) ? setMinimize(false) : setMinimize(true) }

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
                    <PerformanceMonitor 
                        // onIncline={rootStore.cubeStore.increaseSteps} 
                        onChange={({refreshrate}) => { 
                            rootStore.cubeStore.scaleSteps(refreshrate)
                        }}
                        // onFallback={rootStore.cubeStore.decreaseSteps}
                        // onChange={({ factor }) => setDpr(0.5 + 1.5 * factor)}
                    />
                    {/* <CameraControls/> */}
                    <color 
                        attach="background" 
                        args={["#777777"]}
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
                    {/* <HandMenuControls> */}
                        {/* <>
                            <Button 
                                text="crop mode" 
                                position={[0.27, 0]}
                                onSelect={rootStore.cubeStore.toggleCropMode}
                                toggleOn={true}
                            />
                            <Button 
                                text="crop" 
                                position={[0.27, -0.12]}
                                onSelect={rootStore.cropCube}
                            />
                            <CropPanel/>
                        </> */}
                        {/* <Button 
                            text="x" 
                            width={0.1}
                            position={[0.2, -0.43]}
                            backgroundColor={0xED1C24}
                            onSelect={toggleHandMenu}
                        /> */}
                    {/* </HandMenuControls> */}
                    <WorldspaceMenu position={[1,1.5,-1.5]}>
                        <TextPanel/>
                    </WorldspaceMenu>
                    
                     
                    <CubeControls>
                        <Bvh>
                            <DataCube />
                        </Bvh>
                    </CubeControls>
                    
                </XR>
            </Canvas>
        </>
    );
}

const App = observer(AppView);
export default App;