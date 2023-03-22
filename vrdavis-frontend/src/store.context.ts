// COMPOSISTION ROOT

import { createContext } from 'react';
import { BackendStore } from './stores/backend.store';
import { CubeStore } from './stores/cube.store';
import { SignallingStore } from './stores/signalling.store';

interface RootContextInterface {
    backendStore: BackendStore;
    cubeStore: CubeStore;
    signallingStore: SignallingStore;
}

const backendStore = new BackendStore();
const cubeStore = new CubeStore();
const signallingStore = new SignallingStore();

export const RootContext = createContext<RootContextInterface>({
    backendStore,
    cubeStore,
    signallingStore
});