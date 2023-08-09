import { makeAutoObservable, computed, action } from "mobx";
import LRUCache from "mnemonist/lru-cache";
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

export const CUBELET_SIZE = 256;

interface CubeletMessageArgs {
    width: number;
    height: number;
    length: number;
    requestId: number;
    cubeCoordinate: number;
    layerXY: number;
    layerZ: number;
    fileId: number;
    compression?: number;
    nanEncodings?: Int32Array;
}

export class CubeletStore {
    rootStore: RootStore;

    readonly cubeletStream: Subject<CubeletStreamDetails>;

    // cache
    private readonly cacheMapCompressedCubelets: Map<number, LRUCache<number, CompressedCubelet>>;
    private cachedCubelets: LRUCache<number, Cubelet>;
    private lruCapacitySystem: number;

    private readonly pendingRequests: Map<string, Map<string, boolean>>;

    // compression
    private readonly pendingDecompressions: Map<string, Map<number, boolean>>;
    private readonly workers: Worker[];
    private compressionRequestCounter: number;
    workersReady: boolean[];

    // synchronisation
    private pendingSynchronisedCubelets: Map<string, Array<string>>;
    private receivedSynchronisedCubelets: Map<string, Array<{coordinate: string; cubelet: Cubelet}>>;

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
        // const numTilesPerTexture = (TEXTURE_SIZE * TEXTURE_SIZE) / (TILE_SIZE * TILE_SIZE);
        // const numTextures = Math.min(Math.ceil(lruCapacityGPU / numTilesPerTexture), MAX_TEXTURES);
        // lruCapacityGPU = numTextures * numTilesPerTexture;
        // console.log(`lruGPU capacity rounded to : ${lruCapacityGPU}`);

        // this.textureArray = new Array<WebGLTexture>(numTextures);
        // this.initTextures();
        // this.resetCoordinateQueue();
        // this.cachedTiles = new LRUCache<number, RasterTile>(Float64Array, null, lruCapacityGPU);

        // L2 cache: compressed tiles on system memory
        // this.lruCapacitySystem = lruCapacitySystem;
    };

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, { 
            rootStore: false,
            zfpReady: computed,
            setWorkerReady: action 
        });
        this.rootStore = rootStore;

        // caching
        this.cacheMapCompressedCubelets = new Map<number, LRUCache<number, CompressedCubelet>>();
        
        this.pendingRequests = new Map<string, Map<string, boolean>>();

        // compression
        this.compressionRequestCounter = 0;
        this.workers = new Array<Worker>(Math.min(navigator.hardwareConcurrency || 4, 4));
        this.workersReady = new Array<boolean>(this.workers.length);
        this.pendingDecompressions = new Map<string, Map<number, boolean>>();

        this.remainingCubelets = 0;

        this.receivedSynchronisedCubelets = new Map<string, Array<{coordinate: string; cubelet: Cubelet}>>();
        this.pendingSynchronisedCubelets = new Map<string, Array<string>>();
        this.cubeletStream = new Subject<CubeletStreamDetails>();
        this.rootStore.backendStore.cubeletStream.subscribe(this.handleStreamedCubelets);
    
        // for (let i = 0; i < this.workers.length; i++) {
        //     this.workers[i] = new ZFPWorker();
        //     this.workers[i].onmessage = (event: MessageEvent) => {
        //         if (event.data[0] === "ready") {
        //             this.setWorkerReady(i);
        //         } else if (event.data[0] === "decompress") {
        //             const buffer = event.data[1];
        //             const eventArgs = event.data[2] as TileMessageArgs;
        //             const length = eventArgs.width * eventArgs.subsetHeight;
        //             const resultArray = new Float32Array(buffer, 0, length);
        //             this.updateStream(eventArgs.fileId, eventArgs.channel, eventArgs.stokes, resultArray, eventArgs.width, eventArgs.subsetHeight, eventArgs.layer, eventArgs.tileCoordinate);
        //         }
        //     };
        // }
    }

    private getCompressedCache(fileId: number) {
        const cache = this.cacheMapCompressedCubelets.get(fileId);
        if (cache) {
            return cache;
        } else {
            const newCache = new LRUCache<number, CompressedCubelet>(Float64Array, null, this.lruCapacitySystem);
            this.cacheMapCompressedCubelets.set(fileId, newCache);
            return newCache;
        }
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
            const gpuCacheCoordinate = CubeletCoordinate.AddFileId(encodedCoordinate, fileId);
            const key = `${encodedCoordinate}_${fileId}`;
            // this.pendingSynchronisedCubelets.set(
            //     key,
            //     cubelets.map(cubelet => cubelet.encode())
            // );
            // this.receivedSynchronisedCubelets.delete(key);
            // this.clearRequestQueue(fileId);
            const pendingRequestsMap = this.pendingRequests?.get(key);
            // const cubeletCached = this.cachedCubelets?.has(key);
            const cubeletCached = this.cachedCubelets?.has(gpuCacheCoordinate);
            if (!cubeletCached && !(pendingRequestsMap && pendingRequestsMap.has(encodedCoordinate))) {
                const compressedCubelet = this.getCompressedCache(fileId).get(encodedCoordinate);
                const pendingCompressionMap = this.pendingDecompressions.get(key);
                const cubeletIsQueuedForDecompression = pendingCompressionMap && pendingCompressionMap.has(encodedCoordinate);
                if (compressedCubelet && !cubeletIsQueuedForDecompression) {
                    if (!pendingCompressionMap) {
                        this.pendingDecompressions.set(key, new Map<number, boolean>());
                    }
                    // Load from L2 cache instead
                    this.asyncDecompressCubelet(fileId, compressedCubelet.cubelet, compressedCubelet.compressionQuality, encodedCoordinate);
                } else if (!compressedCubelet) {
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

        if (cubeletMessage.compressionType !== VRDAVis.CompressionType.NONE 
            && cubeletMessage.compressionType !== VRDAVis.CompressionType.ZFP) {
            console.error("Unsupported compression type");
        }

        if(cubeletMessage.cubelets === null 
            || cubeletMessage.cubelets === undefined) return;

        

        for (let cubelet of cubeletMessage.cubelets) {
            // @ts-ignore
            const encodedCoordinate = CubeletCoordinate.EncodeString(cubelet.x, cubelet.y, cubelet.z, cubelet.layerXY, cubelet.layerZ);
            const key = `${encodedCoordinate}_${cubeletMessage.fileId}`;

            //
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

                if (cubeletMessage.compressionType === VRDAVis.CompressionType.NONE) {
                    // const decompressedData = new Float32Array(cubelet.volumeData.buffer.slice(cubelet.volumeData.byteOffset, cubelet.volumeData.byteOffset + cubelet.volumeData.byteLength));
                    // this.updateStream(tileMessage.fileId, tileMessage.channel, tileMessage.stokes, decompressedData, tile.width, tile.height, tile.layer, encodedCoordinate);
                    // @ts-ignore
                    this.updateStream(cubeletMessage.fileId, new Float32Array(cubelet.volumeData), cubelet.width, cubelet.height, cubelet.length, cubelet.layerXY, cubelet.layerZ, encodedCoordinate);
                } else {
                    this.getCompressedCache(cubeletMessage.fileId).set(encodedCoordinate, {cubelet, compressionQuality: cubeletMessage.compressionQuality});
                    this.asyncDecompressCubelets(cubeletMessage.fileId, cubelet, cubeletMessage.compressionQuality, encodedCoordinate);
                }
                
                
            } else {
                console.warn(`No pending request for cubelet (${cubelet.x}, ${cubelet.y}, ${cubelet.z}, ${cubelet.layerXY}, ${cubelet.layerZ}) and key=${key}`);
            }
        }
    }

    private asyncDecompressCubelets(fileId: number, cubelet: VRDAVis.ICubeletParams, precision: number, tileCoordinate: number) {
        const compressedArray = cubelet.volumeData;
        const workerIndex = this.compressionRequestCounter % this.workers.length;
        const nanEncodings32 = new Int32Array(cubelet.nanEncodings.slice(0).buffer);
        let compressedView = new Uint8Array(Math.max(compressedArray.byteLength, cubelet.width * cubelet.height * cubelet.length));
        compressedView.set(compressedArray);

        const encodedCoordinate = CubeletCoordinate.EncodeString(cubelet.x, cubelet.y, cubelet.z, cubelet.layerXY, cubelet.layerZ);
            const key = `${encodedCoordinate}_${cubeletMessage.fileId}`;
        const pendingCompressionMap = this.pendingDecompressions.get(key);
        if (!pendingCompressionMap) {
            console.warn("Problem decompressing tile!");
            return;
        }
        pendingCompressionMap.set(tileCoordinate, true);

        const eventArgs: CubeletMessageArgs = {
            fileId,
            width: cubelet.width,
            height: cubelet.height,
            length: cubelet.length,
            compression: precision,
            nanEncodings: nanEncodings32,
            tileCoordinate,
            layerXY: cubelet.layerXY,
            layerZ: cubelet.layerZ,
            requestId: this.compressionRequestCounter
        };

        this.workers[workerIndex].postMessage(["decompress", compressedView.buffer, eventArgs], [compressedView.buffer, nanEncodings32.buffer]);
        this.compressionRequestCounter++;
    }

    updateStream = (fileId: number, decompressedData: Float32Array, width: number, height: number, length: number, layerXY: number, layerZ: number, encodedCoordinate: string) => {
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
            this.rootStore.reconstructionStore.addCubeToTexture(CubeletCoordinate.Decode(encodedCoordinate), cubelet);
        } else {
            // const cubelet: Cubelet = {
            //     width,
            //     height,
            //     length,
            //     data: decompressedData
            // };
            this.cubeletStream.next({ cubeletCount: 1, fileId });
        }
    }

}