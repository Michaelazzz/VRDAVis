import { BackendStore } from "./backend.store";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z, Cubelet, CubeletStore } from "./cubelet.store";
import { FileStore } from "./file.store";
import { CubeStore } from "./cube.store";
import { SignallingStore } from "./signalling.store";
import { CubeView, CubeletCoordinate, Point3D } from "../models";
import { GetRequiredCubelets } from "../utilities";
import { ReconstructionStore } from "./reconstruction.store";

export class RootStore {

    backendStore: BackendStore;
    signallingStore: SignallingStore;
    cubeletStore: CubeletStore;
    fileStore: FileStore;
    cubeStore: CubeStore;
    reconstructionStore: ReconstructionStore;

    constructor() {
        this.backendStore = new BackendStore(this);
        this.signallingStore = new SignallingStore(this);
        this.cubeletStore = new CubeletStore(this);
        this.fileStore = new FileStore(this);
        this.cubeStore = new CubeStore(this);
        this.reconstructionStore = new ReconstructionStore(this);
    }

    connectToServer = async (url: string) => {
        await this.backendStore.connectToServer(url);
    }

    connectToSignallingServer = async () => {
        await this.signallingStore.start();
    }

    // loadFileList = (directory: string) => {
    //     this.backendStore.getFileList(directory);
    // }

    initialCube = () => {
        const cubelets = new Array<CubeletCoordinate>();
        cubelets.push(new CubeletCoordinate(0, 0, 0, 1, 1));
        cubelets.push(new CubeletCoordinate(1, 0, 0, 1, 1));
        cubelets.push(new CubeletCoordinate(0, 1, 0, 1, 1));
        cubelets.push(new CubeletCoordinate(1, 1, 0, 1, 1));
        // this.reconstructionStore.setCubelets(cubelets);
        this.cubeletStore.requestCubelets(cubelets, 0, { x: 0, y: 0, z: 0 });
    }

    // cropCube = (fileId: number, focusPoint: Point3D) => {
    cropCube = () => {
        // if(!this.cubeStore.getCropMode()) return;
        this.reconstructionStore.resetCube();
        console.log('crop cube');
        // get the coordinates of the crop cube coords within the world cube dimensions
        const cubeCoords: CubeView = this.cubeStore.localCubeToWorldCubeCoords;
        // const cubeRatio = this.cubeStore.localCubeToWorldCubeRatio;
        // the world cube dimensions
        const worldCubeState: Point3D = { 
            x: this.fileStore.fileWidth, 
            y: this.fileStore.fileHeight, 
            z: this.fileStore.fileLength
        };
        const cubelets = GetRequiredCubelets(cubeCoords, worldCubeState, {x: CUBELET_SIZE_XY, y: CUBELET_SIZE_XY, z: CUBELET_SIZE_Z});
        // this.reconstructionStore.setCubelets(cubelets);
        // remember previous cube
        this.cubeStore.setPrevious()

        console.log(cubeCoords)

        console.log(cubelets)
        
        // the centre of the crop cube
        const midPointCubeCoords = {
            x: (cubeCoords.xMin + cubeCoords.xMax) / 2.0, 
            y: (cubeCoords.yMin + cubeCoords.yMax) / 2.0,
            z: (cubeCoords.zMin + cubeCoords.zMax) / 2.0
        };

        const cubeletXYSizeFullRes = cubeCoords.mipXY * CUBELET_SIZE_XY;
        const cubeletZSizeFullRes = cubeCoords.mipZ * CUBELET_SIZE_Z;
        const midPointCubeletCoords = {
            x: midPointCubeCoords.x / cubeletXYSizeFullRes - 0.5, 
            y: midPointCubeCoords.y / cubeletXYSizeFullRes - 0.5,
            z: midPointCubeCoords.y / cubeletZSizeFullRes - 0.5
        };
        if (cubelets.length) {
            this.cubeletStore.requestCubelets(cubelets, 0, midPointCubeletCoords);
        } else {
            const coord = new Array<CubeletCoordinate>();
            coord.push(new CubeletCoordinate(0, 0, 0, cubeCoords.mipXY, cubeCoords.mipZ));
            // this.reconstructionStore.setCubelets(coord);
            this.cubeletStore.requestCubelets(coord, 0, midPointCubeletCoords);
        }
    }

    // send cube state and cubelet list to headset
    transferState = () => {
        const message = {
            type: 'transfer',
            data: {
                filename: this.fileStore.getFilename(),
                cubeState: this.cubeStore.getCubeState()
            }
        }
        this.signallingStore.sendDataToPeer(JSON.stringify(message));
    }

    resumeSession = (data: any) => {
        // set cube state
        this.cubeStore.setCubeState(
            data.prevCenter, 
            data.prevCube, 
            data.cropCenter, 
            data.cropCube
        );
        // load file
        this.backendStore.getFileInfo(data.filename);
        this.backendStore.loadFile(data.filename);
    }
}