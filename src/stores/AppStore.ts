import { makeAutoObservable } from "mobx";
import { BackendService } from "../services/BackendService";

export class AppStore {
    private static staticInstance: AppStore;

    static get Instance() {
        return AppStore.staticInstance || new AppStore();
    }

    private backendService: BackendService;

    constructor() {
        makeAutoObservable(this);
        AppStore.staticInstance = this;

        // Assign service instances
        this.backendService = BackendService.Instance;
        
    }

    async initVRDAVis() {
        try {
            await this.connectToServer();
        } catch (err) {
            console.error(err);
        }
    }

    async connectToServer() {
        try {
            let wsUrl = "ws://localhost:9000";
            const ack = await this.backendService.connect(wsUrl);
            // console.log("Acknowlegment received!")
            // console.log(`Connected with session ID ${ack.sessionId}`);
            console.log(`Connected to server ${wsUrl} with session ID ${ack.sessionId}`);
        } catch (err) {
            console.error(err);
        }

        return true;
    }
}