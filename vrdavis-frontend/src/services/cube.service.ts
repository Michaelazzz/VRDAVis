import {Subject} from "rxjs";
import {action, computed, makeObservable, observable} from "mobx";
import {VRDAVis} from "vrdavis-protobuf";
import { BackendService } from "./backend.service";

export interface DataCube {
    data: Float32Array;
    width: number;
    height: number;
    length: number;
}

export interface CompressedTile {
    // tile: VRDAVis.IVolumeData;
    compressionQuality: number;
}

export interface CubeStreamDetails {
    tileCount: number;
    fileId: number;
    channel: number;
    stokes: number;
    flush: boolean;
}

export const CUBE_SIZE = 128;

interface CubeMessageArgs {
    width: number;
    subsetHeight: number;
    subsetLength: number;
    requestId: number;
    // tileCoordinate: number;
    // layer: number;
    // fileId: number;
    // channel: number;
    // stokes: number;
    // compression?: number;
    // nanEncodings?: Int32Array;
}

export class CubeService {
    // private static staticInstance: CubeService;

    // static get Instance() {
    //     if (!CubeService.staticInstance) {
    //         CubeService.staticInstance = new CubeService();
    //     }
    //     return CubeService.staticInstance;   
    // }

    // private readonly backendService: BackendService;
    // readonly volumeDataStream: Subject<CubeStreamDetails>;

    // private constructor() {
    //     makeObservable(this);
    //     this.backendService = BackendService.Instance;

    //     this.volumeDataStream = new Subject<CubeStreamDetails>();
    //     this.backendService.volumeDataStream.subscribe(this.handleStreamedCubes);
    // }

    // handleStreamedCubes = (cubeMessage: VRDAVis.IVolumeData) => {
    //     console.log(cubeMessage);
    // }

    // requestCubeData = () => {
    //     this.backendService.requestData();
    // }
}