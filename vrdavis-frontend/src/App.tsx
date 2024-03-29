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
// import HandMenuControls from "./components/vr UI/HandMenuControls";
import { CubeControls } from "./components/CubeControls";
import { TextPanel } from "./components/vr UI/TextPanel";
import { ButtonPanel } from "./components/vr UI/ButtonPanel";
import { AnalyticsPanel } from "./components/vr UI/AnalyticsPanel";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z } from "./stores/cubelet.store";

const AppView: React.FC = () => {

    // const { signallingStore, backendStore } = useContext(RootContext);
    const { rootStore } = useContext(RootContext);

    // const [minimize, setMinimize] = useState(false);
    // const toggleHandMenu = () => { (minimize) ? setMinimize(false) : setMinimize(true) }

    useEffect(() => {
        // rootStore.connectToServer('ws://localhost:3002'); // local testing
        rootStore.connectToServer('wss://vrdavis01.idia.ac.za/server');
        rootStore.connectToSignallingServer();
        rootStore.cubeletStore.setCache(CUBELET_SIZE_XY * CUBELET_SIZE_XY * CUBELET_SIZE_Z * 10, CUBELET_SIZE_XY * CUBELET_SIZE_XY * CUBELET_SIZE_Z * 10);
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
                        onChange={({refreshrate, fps}) => { 
                            rootStore.cubeStore.scaleSteps(refreshrate, fps)
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

                    <WorldspaceMenu position={[0,1.5,-2]}>
                        <TextPanel position={[0.75, 0.4, 0]} text={'worldspace menu'} />
                        <TextPanel position={[0.75, 0.1, 0]} text={`fps ${rootStore.cubeStore.fps}`} />
                        <group position={[0.75, -0.2, 0]}>
                            <ButtonPanel position={[-0.3, 0, 0.03]} text={'crop mode'} onSelect={rootStore.cubeStore.toggleCropMode} toggleOn={true} />
                            <ButtonPanel position={[0.3, 0, 0.03]} text={'crop cube'} onSelect={rootStore.cropCube} />
                        </group>
                        
                        <TextPanel position={[-0.75, 0.4, 0.03]} text={'analytics'} />
                        <TextPanel position={[-0.75, 0.1, 0.03]} width={1.5} text={`Mean: ${rootStore.statsStore.mean}`} />
                        <TextPanel position={[-0.75, -0.1, 0.03]} width={1.5} text={`Min: ${rootStore.statsStore.min}`} />
                        <TextPanel position={[-0.75, -0.3, 0.03]} width={1.5} text={`Max: ${rootStore.statsStore.max}`} />
                        <AnalyticsPanel 
                            position={[-2.3, -0.05, 0.03]} 
                            text={'Distribution'} 
                            labels={rootStore.statsStore.distributionLabels} 
                            data={rootStore.statsStore.distributionValues}/>
                    </WorldspaceMenu>

                    {/* <WorldspaceMenu position={[0.1,1.5,-2]}>
                        
                    </WorldspaceMenu> */}
                    
                     
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