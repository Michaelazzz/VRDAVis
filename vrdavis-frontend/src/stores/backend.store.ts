import { makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import { Subject } from "rxjs";
import { RootStore } from "./root.store";

// adapted from CARTA

export enum ConnectionStatus {
    CLOSED = 0,
    PENDING = 1,
    ACTIVE = 2
}

type HandlerFunction = (eventId: number, parsedMessage: any) => void;

interface IBackendResponse {
    success?: boolean;
    message?: string;
}

// Deferred class adapted from https://stackoverflow.com/a/58610922/1727322
export class Deferred<T> {
    private _resolve: (value: T) => void = () => {};
    private _reject: (reason: any) => void = () => {};

    private _promise: Promise<T> = new Promise<T>((resolve, reject) => {
        this._reject = reject;
        this._resolve = resolve;
    });

    public get promise(): Promise<T> {
        return this._promise;
    }

    public resolve(value: T) {
        this._resolve(value);
    }

    public reject(reason: any) {
        this._reject(reason);
    }
}

export class BackendStore {

    rootStore: RootStore;
    // fileStore: FileStore;

    private static readonly IcdVersion = 1;
    private static readonly MaxConnectionAttempts = 15;
    private static readonly ConnectionAttemptDelay = 1000;

    connectionStatus: ConnectionStatus;
    readonly loggingEnabled: boolean;
    connectionDropped: boolean;
    endToEndPing: number;

    public sessionId: number;
    public serverUrl: string = '';

    public fileSelected: boolean = false;

    private connection: WebSocket;
    private lastPingTime: number;
    private lastPongTime: number;

    private deferredMap: Map<number, Deferred<IBackendResponse>>;
    private eventCounter: number;

    readonly cubeletStream: Subject<VRDAVis.CubeletData>;
    readonly statsStream: Subject<VRDAVis.RegionStatsData>;

    private readonly decoderMap: Map<VRDAVis.EventType, {decoder: any; handler: HandlerFunction}>;

    directory: string = '../../test-data'; // test directory route
    // directory: string = '/data/cubes1/hdf5';

    constructor (rootStore: RootStore) {
        makeAutoObservable(this, {rootStore: false});
        this.rootStore = rootStore;

        this.loggingEnabled = true;
        this.connectionDropped = false;
        this.serverUrl = 'wss://vrdavis01.idia.ac.za/server';


        this.connection = new WebSocket(this.serverUrl);
        this.endToEndPing = NaN;
        this.lastPingTime = 0;
        this.lastPongTime = 0;

        this.deferredMap = new Map<number, Deferred<IBackendResponse>>();

        this.eventCounter = 1;
        this.sessionId = 0;
        this.endToEndPing = NaN;
        this.connectionStatus = ConnectionStatus.CLOSED;
        this.cubeletStream = new Subject<VRDAVis.CubeletData>();
        this.statsStream = new Subject<VRDAVis.RegionStatsData>();

        // Construct handler and decoder maps
        this.decoderMap = new Map<VRDAVis.EventType, {decoder: any; handler: HandlerFunction}>([
            [VRDAVis.EventType.REGISTER_VIEWER_ACK, {decoder: VRDAVis.RegisterViewerAck.decode, handler: this.onRegisterViewerAck}],
            [VRDAVis.EventType.FILE_LIST_RESPONSE, {decoder: VRDAVis.FileListResponse.decode, handler: this.onFileListResponse}],
            [VRDAVis.EventType.FILE_INFO_RESPONSE, {decoder: VRDAVis.FileInfoResponse.decode, handler: this.onFileInfoResponse}],
            [VRDAVis.EventType.OPEN_FILE_ACK, {decoder: VRDAVis.OpenFileAck.decode, handler: this.onOpenFileAck}],
            [VRDAVis.EventType.CUBELET_DATA, {decoder: VRDAVis.CubeletData.decode, handler: this.onStreamedCubeletData}],
            [VRDAVis.EventType.REGION_STATS_DATA, {decoder: VRDAVis.RegionStatsData.decode, handler: this.onStreamedRegionStatsData}],
            [VRDAVis.EventType.SET_REGION_RESPONSE, {decoder: VRDAVis.SetRegionResponse.decode, handler: this.onSetRegionResponse}]
        ]);

        // check ping every 5 seconds
        setInterval(this.sendPing, 5000);

        // remove
        // this.volumeData = new Float32Array();
    }

    connectToServer = async (url: string) : Promise<VRDAVis.IRegisterViewerAck> => {
        if (this.connection) {
            this.connection.onclose = null;
            this.connection.close();
        }

        const isReconnection: boolean = url === this.serverUrl;
        let connectionAttempts = 0;
        this.connectionDropped = false;
        this.connectionStatus = ConnectionStatus.PENDING;
        this.serverUrl = url;
        this.connection = new WebSocket(this.serverUrl);
        this.connection.binaryType = "arraybuffer";
        this.connection.onmessage = this.messageHandler.bind(this);
        this.connection.onclose = (ev: CloseEvent) => {
            // Only change to closed connection if the connection was originally active or this is a reconnection
            if (this.connectionStatus === ConnectionStatus.ACTIVE || isReconnection || connectionAttempts >= BackendStore.MaxConnectionAttempts) {
                this.connectionStatus = ConnectionStatus.CLOSED;
            } else {
                connectionAttempts++;
                setTimeout(() => {
                    const newConnection = new WebSocket(this.serverUrl);
                    newConnection.binaryType = "arraybuffer";
                    newConnection.onopen = this.connection.onopen;
                    newConnection.onerror = this.connection.onerror;
                    newConnection.onclose = this.connection.onclose;
                    newConnection.onmessage = this.connection.onmessage;
                    this.connection = newConnection;
                }, BackendStore.ConnectionAttemptDelay);
            }
        };
        this.deferredMap.clear();
        this.eventCounter = 1;
        const requestId = this.eventCounter;

        // const deferredResponse = new Deferred<VRDAVis.IRegisterViewerAck>();
        const deferredResponse = new Deferred<IBackendResponse>();
        
        this.deferredMap.set(requestId, deferredResponse);

        this.connection.onopen = () => {
            if (this.connectionStatus === ConnectionStatus.CLOSED) {
                this.connectionDropped = true;

                this.eventCounter = 1;
                this.sessionId = 0;
                this.endToEndPing = NaN;
            }
            this.connectionStatus = ConnectionStatus.ACTIVE;
            const message = VRDAVis.RegisterViewer.create({sessionId: this.sessionId});

            if (this.sendEvent(VRDAVis.EventType.REGISTER_VIEWER, VRDAVis.RegisterViewer.encode(message).finish())) {
                this.deferredMap.set(requestId, deferredResponse);
            } else {
                throw new Error("Could not send REGISTER_VIEWER event");
            }
        }

        return await deferredResponse.promise;
    }

    sendPing = () => {
        if (this.connection && this.connectionStatus === ConnectionStatus.ACTIVE) {
            this.lastPongTime = performance.now();
            this.connection.send("PING");
        }
    }

    updateEndToEndPing = () => {
        this.endToEndPing = this.lastPongTime - this.lastPingTime;
    };

    getFileList = (directory: string) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        } else {
            this.rootStore.fileStore.setDirectory(directory);
            this.directory = directory;
            const message = VRDAVis.FileListRequest.create({directory});
            const requestId = this.eventCounter;
            this.logEvent(VRDAVis.EventType.FILE_LIST_REQUEST, requestId, message, false);
            if (this.sendEvent(VRDAVis.EventType.FILE_LIST_REQUEST, VRDAVis.FileListRequest.encode(message).finish())) {
                const deferredResponse = new Deferred<IBackendResponse>();
                this.deferredMap.set(requestId, deferredResponse);
            } else {
                throw new Error("Could not send FILE_LIST_REQUEST event");
            }
        }
    }

    getFileInfo = (file: string) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        } else {
            this.rootStore.fileStore.setFileName(file);
            const directory = this.directory;
            const message = VRDAVis.FileInfoRequest.create({directory, file});
            const requestId = this.eventCounter;
            this.logEvent(VRDAVis.EventType.FILE_INFO_REQUEST, requestId, message, false);
            if (this.sendEvent(VRDAVis.EventType.FILE_INFO_REQUEST, VRDAVis.FileInfoRequest.encode(message).finish())) {
                const deferredResponse = new Deferred<IBackendResponse>();
                this.deferredMap.set(requestId, deferredResponse);
            } else {
                throw new Error("Could not send FILE_INFO_REQUEST event");
            }
        }
    }

    loadFile = (file: string) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        } else {
            const directory = this.directory;
            const message = VRDAVis.OpenFile.create({
                directory, 
                file
            });
            const requestId = this.eventCounter;
            this.logEvent(VRDAVis.EventType.OPEN_FILE, requestId, message, false);
            if (this.sendEvent(VRDAVis.EventType.OPEN_FILE, VRDAVis.OpenFile.encode(message).finish())) {
                const deferredResponse = new Deferred<IBackendResponse>();
                this.deferredMap.set(requestId, deferredResponse);
                // return await deferredResponse.promise;
            } else {
                throw new Error("Could not send FILE_INFO_REQUEST event");
            }
        }
    }

    addRequiredCubes = (fileId: number, cubelets: string[]) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        }
        else {
            const message = VRDAVis.AddRequiredCubes.create({fileId, cubelets});
            this.logEvent(VRDAVis.EventType.ADD_REQUIRED_CUBES, this.eventCounter, message, false)
            if (!this.sendEvent(VRDAVis.EventType.ADD_REQUIRED_CUBES, VRDAVis.AddRequiredCubes.encode(message).finish())) {
                throw new Error("Could not send FILE_INFO_REQUEST event");
            }
        }
    }

    setRegion = (corners: number[]) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        }
        else {
            const message = VRDAVis.SetRegionRequest.create({corners});
            this.logEvent(VRDAVis.EventType.SET_REGION_REQUEST, this.eventCounter, message, false)
            if (!this.sendEvent(VRDAVis.EventType.SET_REGION_REQUEST, VRDAVis.SetRegionRequest.encode(message).finish())) {
                throw new Error("Could not send REGION_STATS_REQUEST event");
            }
        }
    }

    getRegionStatsData = (statistics: VRDAVis.StatsType[]) => {
        if (this.connectionStatus !== ConnectionStatus.ACTIVE) {
            throw new Error("Not connected");
        }
        else {
            const message = VRDAVis.RegionStatsRequest.create({statistics});
            this.logEvent(VRDAVis.EventType.REGION_STATS_REQUEST, this.eventCounter, message, false)
            if (!this.sendEvent(VRDAVis.EventType.REGION_STATS_REQUEST, VRDAVis.RegionStatsRequest.encode(message).finish())) {
                throw new Error("Could not send REGION_STATS_REQUEST event");
            }
        }
    }

    private messageHandler = (event: MessageEvent) => {
        if (event.data === "PONG") {
            this.lastPongTime = performance.now();
            this.updateEndToEndPing();
            return;
        } 
        else if (event.data.byteLength < 8) {
            console.log("Unknown event format");
            return;
        }

        const eventHeader16 = new Uint16Array(event.data, 0, 2);
        const eventHeader32 = new Uint32Array(event.data, 4, 1);
        const eventData = new Uint8Array(event.data, 8);

        const eventType: VRDAVis.EventType = eventHeader16[0];
        // console.log("Event type: " + eventType)
        const eventIcdVersion = eventHeader16[1];
        // console.log("ICD version: " + eventIcdVersion)
        const eventId = eventHeader32[0];
        // console.log("Event ID: " + eventId)

        if (eventIcdVersion !== BackendStore.IcdVersion) {
            console.warn(`Server event has ICD version ${eventIcdVersion}, which differs from frontend version ${BackendStore.IcdVersion}. Errors may occur`);
        }
        try {
            const decoderEntry = this.decoderMap.get(eventType);
            
            if (decoderEntry) {
                const parsedMessage = decoderEntry.decoder(eventData);
                if (parsedMessage) {
                    this.logEvent(eventType, eventId, parsedMessage);
                    decoderEntry.handler.call(this, eventId, parsedMessage);
                } else {
                    console.log(`Unsupported event response ${eventType}`);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    private onDeferredResponse = (eventId: number, response: IBackendResponse) => {
        const def = this.deferredMap.get(eventId);
        if (def) {
            if (response.success) {
                def.resolve(response);
            } else {
                def.reject(response.message);
            }
        } else {
            console.log(`Can't find deferred for request ${eventId}`);
        }
    }

    private onRegisterViewerAck = (eventId: number, ack: VRDAVis.RegisterViewerAck) => {
        this.sessionId = ack.sessionId;
        this.onDeferredResponse(eventId, ack);
        this.getFileList(this.directory)
    }

    private onFileListResponse = (eventId: number, res: VRDAVis.FileListResponse) => {
        this.rootStore.fileStore.setFileList(res.files)
        this.onDeferredResponse(eventId, res);
    }

    private onOpenFileAck = (eventId: number, ack: VRDAVis.OpenFileAck) => {
        if(!ack.fileInfo) return;
        if(!ack.fileInfo.width || !ack.fileInfo.height || !ack.fileInfo.length) return;
        this.rootStore.fileStore.setDimensions(
            ack.fileInfo.dimensions || 0, 
            ack.fileInfo.width || 0, 
            ack.fileInfo.height || 0, 
            ack.fileInfo.length || 0)
        this.onDeferredResponse(eventId, ack);
        
        this.rootStore.cubeStore.worldspaceCenter = {
            x: ( ack.fileInfo.width / 2.0 ), 
            y: ( ack.fileInfo.height / 2.0),
            z: ( ack.fileInfo.length / 2.0)
        };
        this.rootStore.cubeStore.setCubeDims(
            { x: ack.fileInfo.width, y: ack.fileInfo.height, z: ack.fileInfo.length },
            { x: ack.fileInfo.width / 2, y: ack.fileInfo.height / 2, z: ack.fileInfo.length / 2 }
        );
        this.rootStore.cubeStore.setLocalCube();
        this.rootStore.fileStore.setFileOpen(true);
        // get initial cubes
        this.rootStore.cropCube();
    }

    private onFileInfoResponse = (eventId: number, res: VRDAVis.FileInfoResponse) => {
        if(!res.fileInfo)
            return;
        this.rootStore.fileStore.setFileSize(Number(res.fileInfo.size) || 0);
        this.onDeferredResponse(eventId, res);
    }

    private onStreamedCubeletData = (_eventId: number, cubeletData: VRDAVis.CubeletData) => {
        this.cubeletStream.next(cubeletData)
    }

    private onSetRegionResponse = (_eventId: number, setRegionResponse: VRDAVis.SetRegionResponse) => {
        this.rootStore.statsStore.setRegionStatus(setRegionResponse);
    }

    private sendEvent = (eventType: VRDAVis.EventType, payload: Uint8Array): boolean => {
        if (this.connection.readyState === WebSocket.OPEN) {
            const eventData = new Uint8Array(8 + payload.byteLength);
            const eventHeader16 = new Uint16Array(eventData.buffer, 0, 2);
            const eventHeader32 = new Uint32Array(eventData.buffer, 4, 1);
            eventHeader16[0] = eventType;
            eventHeader16[1] = BackendStore.IcdVersion;
            eventHeader32[0] = this.eventCounter;

            eventData.set(payload, 8);
            this.connection.send(eventData);
            this.eventCounter++;
            return true;
        } else {
            console.log("Error sending event");
            this.eventCounter++;
            return false;
        }
    }

    private logEvent = (eventType: VRDAVis.EventType, eventId: number, message: any, incoming: boolean = true) => {
        const eventName = VRDAVis.EventType[eventType];
        if (this.loggingEnabled) {
            if (incoming) {
                if (eventId === 0) {
                    console.log(`<== ${eventName} [Stream]`);
                } else {
                    console.log(`<== ${eventName} [${eventId}]`);
                }
            } else {
                console.log(`${eventName} [${eventId}] ==>`);
            }
            console.log(message);
        }
    }

    private onStreamedRegionStatsData(_eventId: number, regionStatsData: VRDAVis.RegionStatsData) {
        this.statsStream.next(regionStatsData);
    }
}