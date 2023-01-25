// COMPOSISTION ROOT

import { createContext } from 'react';
import { AppStore } from './stores/root.store';
import { BackendStore } from './stores/backend.store';
import { CubeStore } from './stores/cube.store';
import { SignallingStore } from './stores/signalling.store';
import { WebRTCStore } from './stores/webRTC.store';

interface RootContextInterface {
    appStore: AppStore
    backendStore: BackendStore;
    cubeStore: CubeStore;
    signallingStore: SignallingStore;
    webRTCStore: WebRTCStore;
}

const appStore = new AppStore();
const backendStore = new BackendStore();
const cubeStore = new CubeStore();
const signallingStore = new SignallingStore();
const webRTCStore = new WebRTCStore();

export const RootContext = createContext<RootContextInterface>({
    appStore,
    backendStore,
    cubeStore,
    signallingStore,
    webRTCStore
});