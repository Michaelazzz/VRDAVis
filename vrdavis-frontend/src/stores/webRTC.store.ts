import { makeAutoObservable } from "mobx";
import { RootStore } from "./root.store";

export class WebRTCStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }
}