// COMPOSISTION ROOT

import { createContext, useContext } from 'react';
import { BackendStore } from './stores/backend.store';
import { CubeStore } from './stores/cube.store';
import { SignallingStore } from './stores/signalling.store';
import { WebRTCStore } from './stores/webRTC.store';

interface RootContextInterface {
    backendStore: BackendStore;
    cubeStore: CubeStore;
    signallingStore: SignallingStore;
    webRTCStore: WebRTCStore;
}

const backendStore = new BackendStore();
const cubeStore = new CubeStore();
const signallingStore = new SignallingStore();
const webRTCStore = new WebRTCStore();

export const RootContext = createContext<RootContextInterface>({
    backendStore,
    cubeStore,
    signallingStore,
    webRTCStore
});