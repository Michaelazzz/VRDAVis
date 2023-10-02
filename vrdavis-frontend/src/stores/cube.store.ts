import { makeAutoObservable} from "mobx";
import { RootStore } from "./root.store";
import { VRDAVis } from "vrdavis-protobuf";
import { CubeView, Point3D } from "../models";
import { minMax3D, subtract3D } from "../utilities";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z } from "./cubelet.store";

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
    cropMode: boolean;
    private readonly worldspaceCenter: Point3D;
    // public readonly cubeInfo: CubeInfo;
    // private readonly cubeVoxelRatio: number;

    prevCube: Point3D = { x: 1, y: 1, z: 1 };
    prevCenter: Point3D ={x: 0, y: 0, z: 0};

    cropCube: Point3D = { x: 1, y: 1, z: 1 };
    cropCenter: Point3D = {x: 0, y: 0, z: 0};

    constructor (rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.cropMode = false;
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

    get maxXYMip(): number {
        return Math.pow(2, Math.ceil(Math.log2(this.rootStore.fileStore.fileWidth/this.cropCube.x)))/CUBELET_SIZE_XY;
    }

    get maxZMip(): number {
        return Math.pow(2, Math.ceil(Math.log2(this.rootStore.fileStore.fileLength/this.cropCube.z)))/CUBELET_SIZE_Z;
    }

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
        // adjust crop center to position in worldspace
        const adjustedCenter = {
            x: (this.cropCenter.x + this.prevCube.x)*cropDims.x,
            y: (this.cropCenter.y + this.prevCube.y)*cropDims.y,
            z: (this.cropCenter.z + this.prevCube.z)*cropDims.z
        }
        // get the position of the corners of the crop cube in worldspace context
        const corners = [
            { x: adjustedCenter.x - cropDims.x / 2.0, y: adjustedCenter.y - cropDims.y / 2.0, z: adjustedCenter.z - cropDims.z / 2.0 },
            { x: adjustedCenter.x - cropDims.x / 2.0, y: adjustedCenter.y - cropDims.y / 2.0, z: adjustedCenter.z + cropDims.z / 2.0 },
            { x: adjustedCenter.x - cropDims.x / 2.0, y: adjustedCenter.y + cropDims.y / 2.0, z: adjustedCenter.z - cropDims.z / 2.0 },
            { x: adjustedCenter.x - cropDims.x / 2.0, y: adjustedCenter.y + cropDims.y / 2.0, z: adjustedCenter.z + cropDims.z / 2.0 },
            { x: adjustedCenter.x + cropDims.x / 2.0, y: adjustedCenter.y - cropDims.y / 2.0, z: adjustedCenter.z - cropDims.z / 2.0 },
            { x: adjustedCenter.x + cropDims.x / 2.0, y: adjustedCenter.y - cropDims.y / 2.0, z: adjustedCenter.z + cropDims.z / 2.0 },
            { x: adjustedCenter.x + cropDims.x / 2.0, y: adjustedCenter.y + cropDims.y / 2.0, z: adjustedCenter.z - cropDims.z / 2.0 },
            { x: adjustedCenter.x + cropDims.x / 2.0, y: adjustedCenter.y + cropDims.y / 2.0, z: adjustedCenter.z + cropDims.z / 2.0 }
        ];

        // const mipAdjustment = PreferenceStore.Instance.lowBandwidthMode ? 2.0 : 1.0; // bias
        const {minPoint, maxPoint} = minMax3D(corners);
        const mipXYExact = Math.max(1.0, this.maxXYMip);
        const mipXYLog2 = Math.log2(mipXYExact);
        const mipXYLog2Rounded = Math.round(mipXYLog2);
        const mipXYRoundedPow2 = Math.pow(2, mipXYLog2Rounded);
        const mipZExact = Math.max(1.0, this.maxZMip);
        const mipZLog2 = Math.log2(mipZExact);
        const mipZLog2Rounded = Math.round(mipZLog2);
        const mipZRoundedPow2 = Math.pow(2, mipZLog2Rounded);

        return {
            xMin: minPoint.x,
            xMax: maxPoint.x,
            yMin: minPoint.y,
            yMax: maxPoint.y,
            zMin: minPoint.z,
            zMax: maxPoint.z,
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

    getCubeState = () => {
        return {
            prevCenter: this.prevCenter,
            prevCube: this.prevCube,
            cropCenter: this.cropCenter,
            cropCube: this.cropCube
        }
    }

    setCubeState = (prevCenter: Point3D, prevCube: Point3D, cropCenter: Point3D, cropCube: Point3D) => {
        this.prevCenter = prevCenter;
        this.prevCube = prevCube;
        this.cropCenter = cropCenter;
        this.cropCube = cropCube;
    }

    setCubeDims = (dims: Point3D, center: Point3D) => {
        this.cropCube.x = dims.x
        this.cropCube.y = dims.y
        this.cropCube.z = dims.z
        this.cropCenter.x = center.x
        this.cropCenter.y = center.y
        this.cropCenter.z = center.z
    }

    setCropMode = (mode: boolean) => {
        this.cropMode = mode;
    }

    getCropMode = () => {
        return this.cropMode;
    }
}