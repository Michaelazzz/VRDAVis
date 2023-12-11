// TODO: remove everything once the store is working properly

import {action, makeObservable, observable, runInAction, makeAutoObservable, toJS} from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import {Subject, throwError} from "rxjs";

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

export class BackendService {
    private static staticInstance: BackendService;

    static get Instance() {
        if (!BackendService.staticInstance) {
            BackendService.staticInstance = new BackendService();
        }
        return BackendService.staticInstance;
    }

    private static readonly IcdVersion = 1;
    private static readonly MaxConnectionAttempts = 15;
    private static readonly ConnectionAttemptDelay = 1000;

    // private webRTCService: WebRTCService;
    connectionStatus: ConnectionStatus;
    readonly loggingEnabled: boolean;
    connectionDropped: boolean;
    endToEndPing: number;

    public sessionId: number;
    public serverUrl: string;

    // @ts-ignore
    private connection: WebSocket;
    // private lastPingTime: number;
    // private lastPongTime: number;
    private deferredMap: Map<number, Deferred<IBackendResponse>>;
    private eventCounter: number;

    // readonly volumeDataStream: Subject<VRDAVis.VolumeData>;
    
    private readonly decoderMap: Map<VRDAVis.EventType, {decoder: any; handler: HandlerFunction}>;

    private constructor() {
        this.loggingEnabled = true;
        this.connectionDropped = false;
        this.serverUrl = 'ws://localhost:9000';

        this.deferredMap = new Map<number, Deferred<IBackendResponse>>();

        this.eventCounter = 1;
        this.sessionId = 0;
        this.endToEndPing = NaN;
        this.connectionStatus = ConnectionStatus.CLOSED;
        // this.volumeDataStream = new Subject<VRDAVis.VolumeData>();

        // Construct handler and decoder maps
        this.decoderMap = new Map<VRDAVis.EventType, {decoder: any; handler: HandlerFunction}>([
            [VRDAVis.EventType.REGISTER_VIEWER_ACK, {decoder: VRDAVis.RegisterViewerAck.decode, handler: this.onRegisterViewerAck}],
            // [VRDAVis.EventType.VOLUME_DATA, {decoder: VRDAVis.VolumeData.decode, handler: this.onStreamedVolumeData}],
        ]);

        // check ping every 5 seconds
        setInterval(this.sendPing, 5000);
    }

    async connect(url: string): Promise<VRDAVis.IRegisterViewerAck> 
    {
        // if (this.connection) {
        //     this.connection.onclose = null;
        //     this.connection.close();
        // }

        const isReconnection: boolean = url === this.serverUrl;
        let connectionAttempts = 0;
        this.connectionDropped = false;
        this.connectionStatus = ConnectionStatus.PENDING;
        this.serverUrl = url;
        this.connection = new WebSocket(this.serverUrl);
        this.connection.binaryType = "arraybuffer";
        this.connection.onmessage = this.messageHandler.bind(this);
        this.connection.onclose = (ev: CloseEvent) => runInAction(() => {
            // Only change to closed connection if the connection was originally active or this is a reconnection
            if (this.connectionStatus === ConnectionStatus.ACTIVE || isReconnection || connectionAttempts >= BackendService.MaxConnectionAttempts) {
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
                }, BackendService.ConnectionAttemptDelay);
            }
        });
        this.deferredMap.clear();
        this.eventCounter = 1;
        const requestId = this.eventCounter;

        const deferredResponse = new Deferred<VRDAVis.IRegisterViewerAck>();
        // @ts-ignore
        this.deferredMap.set(requestId, deferredResponse);

        this.connection.onopen = action(() => {
            if (this.connectionStatus === ConnectionStatus.CLOSED) {
                this.connectionDropped = true;
            }
            this.connectionStatus = ConnectionStatus.ACTIVE;
            const message = VRDAVis.RegisterViewer.create({sessionId: this.sessionId});
            // observer map is cleared, so that old subscriptions don't get incorrectly fired
            // this.logEvent(VRDAVis.EventType.REGISTER_VIEWER, requestId, message, false);
            
            // console.log("session id: " + this.sessionId);
            // console.log(message);

            if (this.sendEvent(VRDAVis.EventType.REGISTER_VIEWER, VRDAVis.RegisterViewer.encode(message).finish())) {
                // @ts-ignore
                this.deferredMap.set(requestId, deferredResponse);
            } else {
                throw new Error("Could not send REGISTER_VIEWER event");
            }
           
        });

        // this.connection.onerror = ev => {
        //     console.log(ev);
        // };

        return await deferredResponse.promise;
    }

    sendPing = () => {
        if (this.connection && this.connectionStatus === ConnectionStatus.ACTIVE) {
            // this.lastPingTime = performance.now();
            this.connection.send("PING");
        }
    };

    updateEndToEndPing = () => {
        // this.endToEndPing = this.lastPongTime - this.lastPingTime;
    };

    private messageHandler(event: MessageEvent) {
        if (event.data === "PONG") {
            // this.lastPongTime = performance.now();
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

        if (eventIcdVersion !== BackendService.IcdVersion) {
            console.warn(`Server event has ICD version ${eventIcdVersion}, which differs from frontend version ${BackendService.IcdVersion}. Errors may occur`);
        }
        try {
            const decoderEntry = this.decoderMap.get(eventType);
            
            if (decoderEntry) {
                const parsedMessage = decoderEntry.decoder(eventData);
                if (parsedMessage) {
                    // this.logEvent(eventType, eventId, parsedMessage);
                    decoderEntry.handler.call(this, eventId, parsedMessage);
                } else {
                    console.log(`Unsupported event response ${eventType}`);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    private onDeferredResponse(eventId: number, response: IBackendResponse) {
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
    };

    // private onStreamedVolumeData(_eventId: number, volumeData: VRDAVis.VolumeData) {
    //     this.volumeDataStream.next(volumeData);
    // }

    private sendEvent(eventType: VRDAVis.EventType, payload: Uint8Array): boolean {
        if (this.connection.readyState === WebSocket.OPEN) {
            const eventData = new Uint8Array(8 + payload.byteLength);
            const eventHeader16 = new Uint16Array(eventData.buffer, 0, 2);
            const eventHeader32 = new Uint32Array(eventData.buffer, 4, 1);
            eventHeader16[0] = eventType;
            eventHeader16[1] = BackendService.IcdVersion;
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

    private logEvent(eventType: VRDAVis.EventType, eventId: number, message: any, incoming: boolean = true) {
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
            console.log("\n");
        }
    }

    requestData() {
        if (this.connectionStatus === ConnectionStatus.ACTIVE) {
            // const message = VRDAVis.create({fileId, tiles, compressionQuality: quality, compressionType: CARTA.CompressionType.ZFP});
        }
    }
}