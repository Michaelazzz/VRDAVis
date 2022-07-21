// COMPOSISTION ROOT

import React from 'react';
import { AppStore } from './stores/AppStore';

export interface AppContextInterface {
    appStore: AppStore,
}

const appStore = new AppStore();

export const AppContext = React.createContext<AppContextInterface>({
    appStore,
});

export const useAppStore = () => React.useContext(AppContext);