import { Subject } from "rxjs";
import { makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import { BackendStore } from "./backend.store";
import { useContext } from "react";
import { RootContext } from "../store.context";

export interface DataCube {
    data: Float32Array;
    width: number;
    height: number;
    length: number;
}

export interface CompressedCube {
    cubelet: VRDAVis.ICubeData;
    compressionQuality: number;
}

export interface CubeStreamDetails {
    cubeletCount: number;
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
    cubeCoordinate: number;
    layer: number;
    fileId: number;
    channel: number;
    stokes: number;
    compression?: number;
    nanEncodings?: Int32Array;
}

export class CubeStore {
    rootStore = useContext(RootContext);
    backendStore = this.rootStore.backendStore
    readonly volumeDataStream: Subject<CubeStreamDetails>;
    
    constructor() {
        makeAutoObservable(this);
        
        this.volumeDataStream = new Subject<CubeStreamDetails>();
        this.backendStore.cubeDataStream.subscribe(this.handleStreamedCubes);
    }

    handleStreamedCubes = (cubeMessage: VRDAVis.ICubeData) => {
        console.log(cubeMessage);
    }

    // requestCubeData = () => {
    //     this.backendStore.requestData();
    // }
}