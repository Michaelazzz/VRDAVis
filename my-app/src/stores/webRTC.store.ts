import { makeAutoObservable } from "mobx";

export class WebRTCStore {
    constructor () {
        makeAutoObservable(this);
    }
}