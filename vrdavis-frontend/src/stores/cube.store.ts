import { makeAutoObservable} from "mobx";
import { RootStore } from "./root.store";
import { VRDAVis } from "vrdavis-protobuf";
import { CubeView, Point3D } from "../models";
import { minMax3D, subtract3D } from "../utilities";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z } from "./cubelet.store";
import { clamp } from "three/src/math/MathUtils";
// import { clamp } from "three/src/math/MathUtils";

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
    worldspaceCenter: Point3D = { x: 0, y: 1.5, z: -1 };
    // public readonly cubeInfo: CubeInfo;
    // private readonly cubeVoxelRatio: number;

    scaleFactor: number = 100;

    localCube: Point3D = { x: 1, y: 1, z: 1 };
    localCenter: Point3D = {x: 0, y: 0, z: 0};

    cropCube: Point3D = { x: 1, y: 1, z: 1 };
    cropCenter: Point3D = {x: 0, y: 0, z: 0};

    currentXYMip: number = 1;
    currentZMip: number = 1;

    fps: number = 0;

    steps: number = 100;
    defaultSteps: number = 100;
    currentSteps: number = 0;
    prevSteps: number = 0;
    rateOfChange: number = 0.1;
    targetRefresh: number = 40;

    constructor (rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.cropMode = false;
        this.rootStore = rootStore;
    }

    get centerMovement(): Point3D {
        return subtract3D(this.worldspaceCenter, this.cropCenter);
    }

    get maxXYMip(): number {
        const mipX = Math.pow(2, Math.ceil(Math.log2(this.cropCube.x * this.currentXYMip)))/CUBELET_SIZE_XY;
        const mipY = Math.pow(2, Math.ceil(Math.log2(this.cropCube.y * this.currentXYMip)))/CUBELET_SIZE_XY;
        return (mipX > mipY) ? mipX : mipY
    }

    get maxZMip(): number {
        return Math.pow(2, Math.ceil(Math.log2(this.cropCube.z)))/CUBELET_SIZE_Z;
    }

    get cropCubeToLocalCubeCoords(): CubeView {
        // crop cube dimensions in world space
        const adjustedDims: Point3D = { 
            x: this.cropCube.x * this.currentXYMip,
            y: this.cropCube.y * this.currentXYMip,
            z: this.cropCube.z * this.currentZMip
        };
        // adjust crop center to position in worldspace
        const adjustedCenter = {
            x: (this.cropCenter.x * this.currentXYMip),
            y: (this.cropCenter.y * this.currentXYMip),
            z: (this.cropCenter.z * this.currentZMip)
        }
        // console.log(adjustedCenter)
        // get the position of the corners of the crop cube in worldspace context
        const corners = [
            { x: adjustedCenter.x - adjustedDims.x / 2.0, y: adjustedCenter.y - adjustedDims.y / 2.0, z: adjustedCenter.z - adjustedDims.z / 2.0 },
            { x: adjustedCenter.x - adjustedDims.x / 2.0, y: adjustedCenter.y - adjustedDims.y / 2.0, z: adjustedCenter.z + adjustedDims.z / 2.0 },
            { x: adjustedCenter.x - adjustedDims.x / 2.0, y: adjustedCenter.y + adjustedDims.y / 2.0, z: adjustedCenter.z - adjustedDims.z / 2.0 },
            { x: adjustedCenter.x - adjustedDims.x / 2.0, y: adjustedCenter.y + adjustedDims.y / 2.0, z: adjustedCenter.z + adjustedDims.z / 2.0 },
            { x: adjustedCenter.x + adjustedDims.x / 2.0, y: adjustedCenter.y - adjustedDims.y / 2.0, z: adjustedCenter.z - adjustedDims.z / 2.0 },
            { x: adjustedCenter.x + adjustedDims.x / 2.0, y: adjustedCenter.y - adjustedDims.y / 2.0, z: adjustedCenter.z + adjustedDims.z / 2.0 },
            { x: adjustedCenter.x + adjustedDims.x / 2.0, y: adjustedCenter.y + adjustedDims.y / 2.0, z: adjustedCenter.z - adjustedDims.z / 2.0 },
            { x: adjustedCenter.x + adjustedDims.x / 2.0, y: adjustedCenter.y + adjustedDims.y / 2.0, z: adjustedCenter.z + adjustedDims.z / 2.0 }
        ];
        // console.log(this.cropCenter)
        // console.log(adjustedCenter)
        // console.log(this.cropCube)
        // console.log(adjustedDims)
        // console.log(corners)

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

        this.currentXYMip = mipXYRoundedPow2;
        this.currentZMip = mipZRoundedPow2;

        return {
            // clamp the values to within the full resolution cube
            xMin: (minPoint.x <= 0) ? 0 : minPoint.x,
            xMax: (maxPoint.x >= this.rootStore.fileStore.fileWidth) ? this.rootStore.fileStore.fileWidth : maxPoint.x,
            yMin: (minPoint.y <= 0) ? 0 : minPoint.y,
            yMax: (maxPoint.y >= this.rootStore.fileStore.fileHeight) ? this.rootStore.fileStore.fileHeight : maxPoint.y,
            zMin: (minPoint.z <= 0) ? 0 : minPoint.z,
            zMax: (maxPoint.z >= this.rootStore.fileStore.fileLength) ? this.rootStore.fileStore.fileLength : maxPoint.z,
            mipXY: mipXYRoundedPow2,
            mipZ: mipZRoundedPow2,
        };
    }

    setLocalCube = () => {
        this.localCenter = { x: this.cropCenter.x, y: this.cropCenter.y, z: this.cropCenter.z };
        this.localCube = { x: this.cropCube.x, y: this.cropCube.y, z: this.cropCube.z };
    }

    getCubeState = () => {
        return {
            localCenter: this.localCenter,
            localCube: this.localCube,
            cropCenter: this.cropCenter,
            cropCube: this.cropCube
        }
    }

    setCubeState = (localCenter: Point3D, localCube: Point3D, cropCenter: Point3D, cropCube: Point3D) => {
        this.localCenter = localCenter;
        this.localCube = localCube;
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

    toggleCropMode = () => {
        this.cropMode = (this.cropMode) ? false : true;
    }

    getCropMode = () => {
        return this.cropMode;
    }

    setSteps = (num: number) => {
        this.steps = num;
    }

    getSteps = () => {
        return this.steps;
    }

    decreaseSteps = () => {
        this.steps = 32;
    }

    increaseSteps = () => {
        this.steps = 128;
    }

    scaleSteps = (refreshrate: number) => {
        this.fps = refreshrate;
        // if(fps < 40) {
            // if(this.steps < 40) this.rootStore.reconstructionStore.downsizeData();
            this.currentSteps = this.steps;
            let deltaStep = this.rateOfChange * this.currentSteps * (refreshrate-this.targetRefresh) / this.targetRefresh;
            if (deltaStep < 0){ deltaStep *= 2;}
            this.steps += deltaStep;
            this.steps = clamp(Math.floor(this.steps), 32, 128);
        // } else {
            // this.steps = this.defaultSteps;
        // }
        // console.log(fps)
        // console.log(this.steps)
    }

    setWorldspaceCenter = (x: number, y: number, z: number) => {
        this.worldspaceCenter = {x, y, z};
    }

}