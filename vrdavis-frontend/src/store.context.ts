// COMPOSISTION ROOT

import { createContext } from 'react';
import { RootStore } from './stores/root.store';

interface RootContextInterface {
    rootStore: RootStore;
}

const rootStore = new RootStore();

export const RootContext = createContext<RootContextInterface>({
    rootStore
});