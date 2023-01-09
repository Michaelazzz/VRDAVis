import { makeAutoObservable } from "mobx";
import { BackendService } from "../services/BackendService";
// import { CubeService } from "../services/CubeService";
import { WebRTCService } from "../services/webRTC.service";

export class AppStore {
    private static staticInstance: AppStore;

    static get Instance() {
        return AppStore.staticInstance || new AppStore();
    }

    private backendService: BackendService;
    // private cubeService: CubeService;
    // private webRTCService: WebRTCService;

    constructor() {
        makeAutoObservable(this);
        AppStore.staticInstance = this;

        // Assign service instances
        this.backendService = BackendService.Instance;
        // this.cubeService = CubeService.Instance;
        // this.webRTCService = WebRTCService.Instance;

        // Subscribe to frontend streams
        // this.cubeService.volumeDataStream.subscribe(this.handleDataStream)
    }

    async initVRDAVis() {
        try {
            // await this.connectToServer();
            // request data after connection
            // await this.requestData();

            // RTC connection
            // this.webRTCService.createPeerConnection();
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

    async requestData() {
        console.log('request data');
    }

    // handleDataStream() {
        
    // }
}