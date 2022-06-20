import {action, makeObservable, observable, runInAction} from "mobx";
import {VRDAVis} from "vrdavis-protobuf";
import {Subject, throwError} from "rxjs";

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

    private static readonly MaxConnectionAttempts = 15;
    private static readonly ConnectionAttemptDelay = 1000;

    @observable connectionStatus: ConnectionStatus;
    readonly loggingEnabled: boolean;
    @observable connectionDropped: boolean;
    @observable endToEndPing: number;

    public sessionId: number;

    private connection: WebSocket;
    private lastPingTime: number;
    private lastPongTime: number;
    private deferredMap: Map<number, Deferred<IBackendResponse>>;
    private eventCounter: number;

    readonly VolumeDataStream: Subject<VRDAVis.VolumeData>;
    private readonly decoderMap: Map<VRDAVis.EventType, {messageClass: any; handler: HandlerFunction}>;
    
}