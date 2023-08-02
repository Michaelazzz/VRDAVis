import { makeAutoObservable, computed } from "mobx";
import { RootStore } from "./root.store";
import { VRDAVis } from "vrdavis-protobuf";
import { CubeView, Point3D } from "../models";
import { subtract3D } from "../utilities";

export interface CubeInfo {
    fileId: number;
    directory: string;
    // hdu: string;
    fileInfo: VRDAVis.FileInfo;
    // fileInfoExtended: VRDAVis.FileInfoExtended;
    // fileFeatureFlags: number;
    // renderMode: CARTA.RenderMode;
    // beamTable: CARTA.IBeam[];
}

export class CubeStore {
    rootStore: RootStore;
    private readonly worldspaceCenter: Point3D;
    // public readonly cubeInfo: CubeInfo;
    // private readonly cubeVoxelRatio: number;

    prevCenter: Point3D ={x: 0, y: 0, z: 0};
    prevCube: Point3D = { x: 1, y: 1, z: 1 };

    cropCube: Point3D = { x: 1, y: 1, z: 1 };
    cropCenter: Point3D = {x: 0, y: 0, z: 0};

    constructor (rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
        this.worldspaceCenter = {
            x: ( this.rootStore.fileStore.fileWidth / 2.0 ), 
            y: ( this.rootStore.fileStore.fileHeight / 2.0),
            z: ( this.rootStore.fileStore.fileLength / 2.0)
        };
    }

    get centerMovement(): Point3D {
        return subtract3D(this.worldspaceCenter, this.cropCenter);
    }

    // get maxMip(): number {
        // return Math.pow(2, Math.ceil(Math.log2(this.frameInfo.fileInfoExtended.width / CUBE_SIZE)));
    // }

    get localCubeToWorldCubeCoords(): CubeView {
        // worldspace cube dimensions
        const worldWidth = this.rootStore.fileStore.fileWidth;
        const worldHeight = this.rootStore.fileStore.fileHeight;
        const worldLength = this.rootStore.fileStore.fileLength;

        // crop cube dimensions in world space
        const cropDims: Point3D = { 
            x: this.cropCube.x * this.prevCube.x * worldWidth,
            y: this.cropCube.y * this.prevCube.y * worldHeight,
            z: this.cropCube.z * this.prevCube.z * worldLength
        };

        // const mipAdjustment = PreferenceStore.Instance.lowBandwidthMode ? 2.0 : 1.0; // bias
        const mipXYExact = Math.max(1.0, 1.0);
        const mipXYLog2 = Math.log2(mipXYExact);
        const mipXYLog2Rounded = Math.round(mipXYLog2);
        const mipXYRoundedPow2 = Math.pow(2, mipXYLog2Rounded);
        const mipZExact = Math.max(1.0, 1.0);
        const mipZLog2 = Math.log2(mipZExact);
        const mipZLog2Rounded = Math.round(mipZLog2);
        const mipZRoundedPow2 = Math.pow(2, mipZLog2Rounded);

        return {
            xMin: this.cropCenter.x - cropDims.x / 2.0,
            xMax: this.cropCenter.x + cropDims.x / 2.0,
            yMin: this.cropCenter.y - cropDims.y / 2.0,
            yMax: this.cropCenter.y + cropDims.y / 2.0,
            zMin: this.cropCenter.z - cropDims.z / 2.0,
            zMax: this.cropCenter.z + cropDims.z / 2.0,
            mipXY: mipXYRoundedPow2,
            mipZ: mipZRoundedPow2,
        };
    }

    get localCubeToWorldCubeRatio(): Point3D {
        // crop cube ratio
        const cropRatio: Point3D = { 
            x: this.cropCube.x * this.prevCube.x * 1,
            y: this.cropCube.y * this.prevCube.y * 1,
            z: this.cropCube.z * this.prevCube.z * 1
        };

        return cropRatio;
    }

    setPrevious = () => {
        this.prevCenter = { x: this.cropCenter.x, y: this.cropCenter.y, z: this.cropCenter.z };
        this.prevCube = { x: this.cropCube.x, y: this.cropCube.y, z: this.cropCube.z };
    }
}