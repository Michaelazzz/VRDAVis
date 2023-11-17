import { makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import { CubeletCoordinate, Point3D } from "../models";
import { RootStore } from "./root.store";
import { Subject } from "rxjs";

export interface Cubelet {
    data: Float32Array;
    width: number;
    height: number;
    length: number;
}

export interface CompressedCubelet {
    cubelet: VRDAVis.ICubeletData;
    compressionQuality: number;
}

export interface CubeletStreamDetails {
    cubeletCount: number;
    fileId: number;
}

export const CUBELET_SIZE_XY = 64;
export const CUBELET_SIZE_Z = 64;

interface CubeletMessageArgs {
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

export class CubeletStore {
    rootStore: RootStore;

    readonly cubeletStream: Subject<CubeletStreamDetails>;

    private readonly pendingRequests: Map<string, Map<string, boolean>>;
    private pendingSynchronisedCubelets: Map<string, Array<string>>;
    private receivedSynchronisedCubelets: Map<string, Array<{coordinate: string; cubelet: Cubelet}>>;
    
    cachedCubelets: Map<string, Cubelet>;

    remainingCubelets: number;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
        
        this.pendingRequests = new Map<string, Map<string, boolean>>();
        this.cachedCubelets = new Map<string, Cubelet>();

        this.remainingCubelets = 0;

        this.receivedSynchronisedCubelets = new Map<string, Array<{coordinate: string; cubelet: Cubelet}>>();
        this.pendingSynchronisedCubelets = new Map<string, Array<string>>();
        this.cubeletStream = new Subject<CubeletStreamDetails>();
        this.rootStore.backendStore.cubeletStream.subscribe(this.handleStreamedCubelets);
    }

    getCubelets = () => {
        return this.cachedCubelets
    } 

    // get cubelet from cache
    getCubelet(cubeCoordinateEncoded: string, fileId: number) {
        // const gpuCacheCoordinate = CubeCoordinate.AddFileId(cubeCoordinateEncoded, fileId);
        // if (peek) {
        //     return this.cachedTiles.peek(gpuCacheCoordinate);
        // }
        const key = `${cubeCoordinateEncoded}_${fileId}`
        return this.cachedCubelets.get(key);
    }

    requestCubelets(cubelets: CubeletCoordinate[], fileId: number, focusPoint: Point3D) {
        // const key = `${fileId}`;
        const newRequests = new Array<CubeletCoordinate>();
        for (const cubelet of cubelets) {
            
            if (cubelet.layerXY < 0 || cubelet.layerZ < 0) {
                continue;
            }
            const encodedCoordinate = cubelet.encode();
            const key = `${encodedCoordinate}_${fileId}`;
            this.pendingSynchronisedCubelets.set(
                key,
                cubelets.map(cubelet => cubelet.encode())
            );
            this.receivedSynchronisedCubelets.delete(key);
            // this.clearRequestQueue(fileId);
            const pendingRequestsMap = this.pendingRequests?.get(key);
            const cubeletCached = this.cachedCubelets?.has(key);
            if (!cubeletCached && !(pendingRequestsMap && pendingRequestsMap.has(encodedCoordinate))) {
                // Request from backend
                if (!pendingRequestsMap) {
                    this.pendingRequests.set(key, new Map<string, boolean>());
                }
                // @ts-ignore
                this.pendingRequests.get(key).set(encodedCoordinate, true);
                this.updateRemainingCubeletCount();
                newRequests.push(cubelet);
            }
        }
        if (newRequests.length) {
            const sortedRequests = newRequests
                .sort((a, b) => {
                    const aX = focusPoint.x - a.x;
                    const aY = focusPoint.y - a.y;
                    const aZ = focusPoint.z - a.z;
                    const bX = focusPoint.x - b.x;
                    const bY = focusPoint.y - b.y;
                    const bZ = focusPoint.z - b.z;
                    return aX * aX + aY * aY + aZ * aZ - (bX * bX + bY * bY + bZ * bZ);
                })
                .map(cubelet => cubelet.encode());
            this.rootStore.backendStore.addRequiredCubes(fileId, sortedRequests);
        } else {
            this.cubeletStream.next({ cubeletCount: 0, fileId });
        }
    }

    updateRemainingCubeletCount = () => {
        let remainingCubelets = 0;
        this.pendingRequests.forEach(value => (remainingCubelets += value.size));
        this.remainingCubelets = remainingCubelets;
    };

    clearRequestQueue = (fileId?: number) => {
        if (fileId !== undefined) {
            // Clear all requests with the given file ID
            const fileKey = `${fileId}`;
            this.pendingRequests.forEach((value, key) => {
                if (key.includes(fileKey)) {
                    value.clear();
                }
            });
        } else {
            // Clear all requests
            this.pendingRequests.clear();
        }

        this.updateRemainingCubeletCount();
    }

    private clearCubelet = (cubelet: Cubelet, _key: any) => {
        if (cubelet.data) {
            // delete cube.data;
        }
        // this.textureCoordinateQueue.push(tile.textureCoordinate);
    };

    handleStreamedCubelets = (cubeletMessage: VRDAVis.ICubeletData) => {
        // const key = `${cubeletMessage.fileId}`;

        if(cubeletMessage.cubelets === null || cubeletMessage.cubelets === undefined) return;

        for (let cubelet of cubeletMessage.cubelets) {
            // @ts-ignore
            const encodedCoordinate = CubeletCoordinate.EncodeString(cubelet.x, cubelet.y, cubelet.z, cubelet.layerXY, cubelet.layerZ);
            const key = `${encodedCoordinate}_${cubeletMessage.fileId}`;
            // Remove from the requested cubelet map. If in animation mode, don't check if we're still requesting tiles
            const pendingRequestsMap = this.pendingRequests.get(key);
            if (pendingRequestsMap?.has(encodedCoordinate)) {
                if (pendingRequestsMap) {
                    pendingRequestsMap.delete(encodedCoordinate);
                }
                this.updateRemainingCubeletCount();

                // if (tileMessage.compressionType === CARTA.CompressionType.NONE) {
                //     const decompressedData = new Float32Array(tile.imageData.buffer.slice(tile.imageData.byteOffset, tile.imageData.byteOffset + tile.imageData.byteLength));
                //     this.updateStream(tileMessage.fileId, tileMessage.channel, tileMessage.stokes, decompressedData, tile.width, tile.height, tile.layer, encodedCoordinate);
                // } else {
                //     this.getCompressedCache(tileMessage.fileId).set(encodedCoordinate, {tile, compressionQuality: tileMessage.compressionQuality});
                //     this.asyncDecompressTile(tileMessage.fileId, tileMessage.channel, tileMessage.stokes, tile, tileMessage.compressionQuality, encodedCoordinate);
                // }
                
                // @ts-ignore
                this.updateStream(cubeletMessage.fileId, new Float32Array(cubelet.volumeData), cubelet.width, cubelet.height, cubelet.length, cubelet.layerXY, cubelet.layerZ, encodedCoordinate);
            } else {
                console.warn(`No pending request for cubelet (${cubelet.x}, ${cubelet.y}, ${cubelet.z}, ${cubelet.layerXY}, ${cubelet.layerZ}) and key=${key}`);
            }
        }
    }

    updateStream = async (fileId: number, decompressedData: Float32Array, width: number, height: number, length: number, layerXY: number, layerZ: number, encodedCoordinate: string) => {
        const key = `${encodedCoordinate}_${fileId}`;
        const pendingCubelets = this.pendingSynchronisedCubelets.get(key);
        if (pendingCubelets?.length) {
            if (pendingCubelets) {
                this.pendingSynchronisedCubelets.set(
                    key,
                    pendingCubelets.filter(cubelet => cubelet !== encodedCoordinate)
                );
            }
            const cubelet: Cubelet = {
                width,
                height,
                length,
                data: decompressedData
            };
            // console.log(cubelet)
            let receivedCubelets = this.receivedSynchronisedCubelets.get(key);
            if (!receivedCubelets) {
                receivedCubelets = [];
                this.receivedSynchronisedCubelets.set(key, receivedCubelets);
            }
            receivedCubelets.push({coordinate: encodedCoordinate, cubelet: cubelet});
            const cubeletCount = receivedCubelets.length;

            this.receivedSynchronisedCubelets.set(key, receivedCubelets);
            this.cachedCubelets.set(key, cubelet);
            
            this.cubeletStream.next({cubeletCount, fileId});
            
            this.rootStore.reconstructionStore.addCubelet(encodedCoordinate, cubelet);
            if(this.remainingCubelets === 0) {
                // await this.rootStore.reconstructionStore.reconstructCube();
                await this.rootStore.reconstructionStore.reconstructCubeWithWorker();
            }
            
        } else {
            // construct texture when all the cubes have arrived
            // this.cachedCubelets.forEach((value, key, map) => {
            //     console.log(key);
                // this.rootStore.reconstructionStore.addCubeToTexture(CubeletCoordinate.Decode(encodedCoordinate), value);
            // })
            
        }
    }

}