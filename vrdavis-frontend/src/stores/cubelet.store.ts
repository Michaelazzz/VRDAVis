import { makeAutoObservable } from "mobx";
import LRUCache from "mnemonist/lru-cache";
import { VRDAVis } from "vrdavis-protobuf";
import { CubeletCoordinate, Point3D } from "../models";
import { RootStore } from "./root.store";
import { Subject } from "rxjs";

/* eslint import/no-webpack-loader-syntax: off */
import ZFPWorker from "!worker-loader!zfp_wrapper";

export interface Cubelet {
    data: Float32Array;
    width: number;
    height: number;
    length: number;
}

export interface CompressedCubelet {
    cubelet: VRDAVis.ICubeletParams;
    compressionQuality: number;
}

export interface CubeletStreamDetails {
    cubeletCount: number;
    fileId: number;
}

export const CUBELET_SIZE_XY = 128;
export const CUBELET_SIZE_Z = 128;

interface CubeletMessageArgs {
    width: number;
    height: number;
    length: number;
    requestId: number;
    cubeletCoordinate: string;
    layerXY: number;
    layerZ: number;
    fileId: number;
    size: number;
    // data: number[];
    compression?: number;
    nanEncodings?: Int32Array;
}

export class CubeletStore {
    rootStore: RootStore;

    readonly cubeletStream: Subject<CubeletStreamDetails>;

    private readonly cacheMapCompressedCubelets: Map<number, LRUCache<string, CompressedCubelet>>;
    private readonly pendingRequests: Map<string, Map<string, boolean>>;
    private readonly pendingDecompressions: Map<string, Map<string, boolean>>;
    private compressionRequestCounter: number;
    private pendingSynchronisedCubelets: Map<string, Array<string>>;
    receivedSynchronisedCubelets: Map<string, Array<{coordinate: string; cubelet: Cubelet}>>;

    private readonly workers: Worker[];
    workersReady: boolean[];
    
    // @ts-ignore
    cachedCubelets: LRUCache<string, Cubelet>;
    private lruCapacitySystem: number;

    remainingCubelets: number;

    get zfpReady() {
        return this.workersReady && this.workersReady.every(v => v);
    }

    setWorkerReady(index: number) {
        if (index >= 0 && index < this.workersReady.length) {
            this.workersReady[index] = true;
        }
    }

    public setCache = (lruCapacityGPU: number, lruCapacitySystem: number) => {
        // L1 cache: on GPU
        console.log(`lruGPU capacity rounded to : ${lruCapacityGPU}`);
        this.cachedCubelets = new LRUCache<string, Cubelet>(lruCapacityGPU);
        // L2 cache: compressed tiles on system memory
        this.lruCapacitySystem = lruCapacitySystem;
    };

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;

        this.lruCapacitySystem = 0;
        
        this.pendingRequests = new Map<string, Map<string, boolean>>();
        this.cacheMapCompressedCubelets = new Map<number, LRUCache<string, CompressedCubelet>>();
        this.pendingDecompressions = new Map<string, Map<string, boolean>>();

        this.compressionRequestCounter = 0;
        this.remainingCubelets = 0;

        this.receivedSynchronisedCubelets = new Map<string, Array<{coordinate: string; cubelet: Cubelet}>>();
        this.pendingSynchronisedCubelets = new Map<string, Array<string>>();
        this.cubeletStream = new Subject<CubeletStreamDetails>();
        this.rootStore.backendStore.cubeletStream.subscribe(this.handleStreamedCubelets);

        this.workers = new Array<Worker>(Math.min(navigator.hardwareConcurrency || 4, 4));
        this.workersReady = new Array<boolean>(this.workers.length);

        for (let i = 0; i < this.workers.length; i++) {
            this.workers[i] = new ZFPWorker();
            this.workers[i].onmessage = (event: MessageEvent) => {
                if (event.data[0] === "ready") {
                    this.setWorkerReady(i);
                } else if (event.data[0] === "decompress") {
                    const buffer = event.data[1];
                    const eventArgs = event.data[2] as CubeletMessageArgs;
                    const length = eventArgs.width * eventArgs.height * eventArgs.length;
                    const resultArray = new Float32Array(buffer[0], 0, length);
                    this.updateStream(eventArgs.fileId, resultArray, eventArgs.width, eventArgs.height, eventArgs.length, eventArgs.layerXY, eventArgs.layerZ, eventArgs.cubeletCoordinate);
                    this.rootStore.reconstructionStore.dataStream.next({coord: eventArgs.cubeletCoordinate, cubelet: {data: resultArray, width: eventArgs.width, height: eventArgs.height, length: eventArgs.length}} )
                }
            };
        }
    }

    getCubelets = () => {
        return this.cachedCubelets
    } 

    private getCompressedCache(fileId: number) {
        const cache = this.cacheMapCompressedCubelets.get(fileId);
        if (cache) {
            return cache;
        } else {
            const newCache = new LRUCache<string, CompressedCubelet>(this.lruCapacitySystem);
            this.cacheMapCompressedCubelets.set(fileId, newCache);
            return newCache;
        }
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
            const cubeletCached = this.cachedCubelets?.has(key) || false;
            if (!cubeletCached && !(pendingRequestsMap && pendingRequestsMap.has(encodedCoordinate))) {
                const compressedCubelet = this.getCompressedCache(fileId).get(encodedCoordinate);
                const pendingCompressionMap = this.pendingDecompressions.get(key);
                const cubeletIsQueuedForDecompression = pendingCompressionMap && pendingCompressionMap.has(encodedCoordinate);
                if (!pendingCompressionMap) {
                    this.pendingDecompressions.set(key, new Map<string, boolean>());
                }
                if (compressedCubelet && !cubeletIsQueuedForDecompression) {
                    // Load from L2 cache instead
                    this.asyncDecompressCubelet(fileId, compressedCubelet.cubelet, compressedCubelet.compressionQuality, encodedCoordinate);
                } else if (!compressedCubelet) {
                    // Request from backend
                    if (!pendingRequestsMap) {
                        this.pendingRequests.set(key, new Map<string, boolean>());
                    }
                    this.pendingRequests.get(key)?.set(encodedCoordinate, true);
                    this.updateRemainingCubeletCount();
                    newRequests.push(cubelet);
                }
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
        if(cubeletMessage.cubelets === null || cubeletMessage.cubelets === undefined) return;
        if(cubeletMessage.fileId === null || cubeletMessage.fileId === undefined) return;

        for (let cubelet of cubeletMessage.cubelets) {
            // @ts-ignore
            const encodedCoordinate = CubeletCoordinate.EncodeString(cubelet.x, cubelet.y, cubelet.z, cubelet.layerXY, cubelet.layerZ);
            const key = `${encodedCoordinate}_${cubeletMessage.fileId}`;
            const pendingCompressionMap = this.pendingDecompressions.get(key);
            if (!pendingCompressionMap) {
                console.warn(`Missing compression map for key=${key}`);
                return;
            }
            // Remove from the requested cubelet map. If in animation mode, don't check if we're still requesting tiles
            const pendingRequestsMap = this.pendingRequests.get(key);
            if (pendingRequestsMap?.has(encodedCoordinate)) {
                if (pendingRequestsMap) {
                    pendingRequestsMap.delete(encodedCoordinate);
                }
                this.updateRemainingCubeletCount();
                
                // uncompressed data
                // @ts-ignore
                // this.updateStream(cubeletMessage.fileId, new Float32Array(cubelet.volumeData), cubelet.width, cubelet.height, cubelet.length, cubelet.layerXY, cubelet.layerZ, encodedCoordinate);
                
                // compressed data
                this.getCompressedCache(cubeletMessage.fileId).set(encodedCoordinate, {cubelet, compressionQuality: 32});
                this.asyncDecompressCubelet(cubeletMessage.fileId, cubelet, 32, encodedCoordinate);
            } else {
                console.warn(`No pending request for cubelet (${cubelet.x}, ${cubelet.y}, ${cubelet.z}, ${cubelet.layerXY}, ${cubelet.layerZ}) and key=${key}`);
            }
        }
    }

    private asyncDecompressCubelet(fileId: number, cubelet: VRDAVis.ICubeletParams, precision: number, cubeletCoordinate: string) {
        const compressedArray = cubelet.compressedVolumeData;
        console.log(compressedArray);
        const workerIndex = this.compressionRequestCounter % this.workers.length;
        // const nanEncodings32 = new Int32Array(cubelet.nanEncodings.slice(0).buffer);
        let compressedView = new Uint8Array(Math.max(compressedArray!.byteLength, cubelet.width! * cubelet.height! * cubelet.length! * 4));
        compressedView.set(compressedArray!);

        const key = `${cubeletCoordinate}_${fileId}`;
        const pendingCompressionMap = this.pendingDecompressions.get(key);
        if (!pendingCompressionMap) {
            console.warn("Problem decompressing tile!");
            return;
        }
        pendingCompressionMap.set(cubeletCoordinate, true);

        const eventArgs: CubeletMessageArgs = {
            fileId,
            // data: cubelet.volumeData!,
            width: cubelet.width!,
            height: cubelet.height!,
            length: cubelet.length!,
            compression: precision,
            // nanEncodings: nanEncodings32,
            cubeletCoordinate,
            layerXY: cubelet.layerXY!,
            layerZ: cubelet.layerZ!,
            requestId: this.compressionRequestCounter,
            size: compressedArray!.byteLength
        };

        this.workers[workerIndex].postMessage(["decompress", compressedView.buffer, eventArgs], [compressedView.buffer]);
        this.compressionRequestCounter++;
    }

    updateStream = async (fileId: number, decompressedData: Float32Array, width: number, height: number, length: number, layerXY: number, layerZ: number, encodedCoordinate: string) => {
        const key = `${encodedCoordinate}_${fileId}`;
        const pendingCompressionMap = this.pendingDecompressions.get(key);
        if (!pendingCompressionMap) {
            console.warn(`Problem decompressing tile. Missing pending decompression map ${key}!`);
            return;
        }
        
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
            // this.rootStore.reconstructionStore.addCubelet(encodedCoordinate, cubelet);
            
            let receivedCubelets = this.receivedSynchronisedCubelets.get(key);
            if (!receivedCubelets) {
                receivedCubelets = [];
                this.receivedSynchronisedCubelets.set(key, receivedCubelets);
            }
            receivedCubelets.push({coordinate: encodedCoordinate, cubelet: cubelet});
            pendingCompressionMap.delete(encodedCoordinate);
            

            // If all tiles are in place, add them to the LRU and fire the stream observable
            if (!pendingCompressionMap.size) {
                this.pendingDecompressions.delete(key);
                const cubeletCount = receivedCubelets.length;
                this.clearGPUCache(fileId);

                for (const cubeletPair of receivedCubelets) {
                    const gpuCacheCoordinate = CubeletCoordinate.AddFileId(cubeletPair.coordinate, fileId);
                    const oldValue = this.cachedCubelets.setpop(gpuCacheCoordinate, cubeletPair.cubelet);
                    if (oldValue) {
                        this.clearCubelet(oldValue.value, oldValue.key);
                    }
                }
                this.receivedSynchronisedCubelets.set(key, receivedCubelets);
                // this.cachedCubelets.set(key, cubelet);
                this.cubeletStream.next({cubeletCount, fileId });
            }
        } else {
            // await this.rootStore.reconstructionStore.reconstructCube();
            // await this.rootStore.reconstructionStore.reconstructCubeWithWorker(); 
            // single cubelet
            // const rasterTile: RasterTile = {
            //     width,
            //     height,
            //     textureCoordinate: 0,
            //     data: decompressedData
            // };
            // const gpuCacheCoordinate = TileCoordinate.AddFileId(encodedCoordinate, fileId);
            // const oldValue = this.cachedTiles.setpop(gpuCacheCoordinate, rasterTile);
            // if (oldValue) {
            //     this.clearTile(oldValue.value, oldValue.key);
            // }
            // rasterTile.textureCoordinate = this.textureCoordinateQueue.pop();

            // pendingCompressionMap.delete(encodedCoordinate);
            // this.tileStream.next({tileCount: 1, fileId, channel, stokes, flush: false});
        }
    }

    clearGPUCache(fileId: number) {
        const cacheCapacity = this.cachedCubelets.capacity;
        const keys: string[] = [];
        const cubelets: Cubelet[] = [];

        for (const [key, cubelet] of this.cachedCubelets) {
            // Clear tile if it matches the fileId, otherwise add it to the collection of tiles to add to the new cache
            if (CubeletCoordinate.GetFileId(key) === fileId) {
                this.clearCubelet(cubelet, key);
            } else {
                keys.push(key);
                cubelets.push(cubelet);
            }
        }

        // populate new cache with old entries, from oldest to newest, in order to preserve LRU ordering
        // @ts-ignore
        this.cachedCubelets = new LRUCache<string, Cubelet>(Float64Array, null, cacheCapacity);
        for (let i = keys.length - 1; i >= 0; i--) {
            this.cachedCubelets.set(keys[i], cubelets[i]);
        }
    }

}