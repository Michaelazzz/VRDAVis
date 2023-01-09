// COMPOSISTION ROOT

import { createContext, useContext } from 'react';
import { SignallingStore } from './stores/signalling.store';
import { WebRTCStore } from './stores/webRTC.store';

interface RootContextInterface {
    signallingStore: SignallingStore;
    webRTCStore: WebRTCStore;
}

const signallingStore = new SignallingStore();
const webRTCStore = new WebRTCStore();

export const RootContext = createContext<RootContextInterface>({
    signallingStore,
    webRTCStore
});