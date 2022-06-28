import {Subject} from "rxjs";
import {action, computed, makeObservable, observable} from "mobx";
import {VRDAVis} from "vrdavis-protobuf";
import { BackendService } from "./BackendService";

export interface CubeStreamDetails {
    tileCount: number;
    fileId: number;
    channel: number;
    stokes: number;
    flush: boolean;
}

export class CubeService {
    private static staticInstance: CubeService;

    static get Instance() {
        if (!CubeService.staticInstance) {
            CubeService.staticInstance = new CubeService();
        }
        return CubeService.staticInstance;   
    }

    private readonly backendService: BackendService;
    readonly volumeDataStream: Subject<CubeStreamDetails>;

    private constructor() {
        makeObservable(this);
    }
}