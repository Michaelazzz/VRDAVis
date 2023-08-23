import { BackendStore } from "./backend.store";
import { CUBELET_SIZE, Cubelet, CubeletStore } from "./cubelet.store";
import { FileStore } from "./file.store";
import { CubeStore } from "./cube.store";
import { SignallingStore } from "./signalling.store";
import { CubeletCoordinate, Point3D } from "../models";
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
        console.log('crop cube')
        const cubeCoords = this.cubeStore.localCubeToWorldCubeCoords;
        // const cubeRatio = this.cubeStore.localCubeToWorldCubeRatio;
        
        const worldCubeState: Point3D = {
            x: this.fileStore.fileWidth, 
            y: this.fileStore.fileHeight,
            z: this.fileStore.fileLength
        };
        const cubelets = GetRequiredCubelets(cubeCoords, worldCubeState, {x: CUBELET_SIZE, y: CUBELET_SIZE, z: CUBELET_SIZE});
        // this.reconstructionStore.setCubelets(cubelets);
        // remember previous cube
        this.cubeStore.setPrevious()
        
        const midPointCubeCoords = {
            x: (cubeCoords.xMax + cubeCoords.xMin) / 2.0, 
            y: (cubeCoords.yMin + cubeCoords.yMax) / 2.0,
            z: (cubeCoords.zMin + cubeCoords.zMax) / 2.0
        };
        const cubeletXYSizeFullRes = cubeCoords.mipXY * CUBELET_SIZE;
        const cubeletZSizeFullRes = cubeCoords.mipZ * CUBELET_SIZE;
        const midPointCubeletCoords = {
            x: midPointCubeCoords.x / cubeletXYSizeFullRes - 0.5, 
            y: midPointCubeCoords.y / cubeletXYSizeFullRes - 0.5,
            z: midPointCubeCoords.y / cubeletZSizeFullRes - 0.5
        };
        if (cubelets.length) {
            this.cubeletStore.requestCubelets(cubelets, 0, midPointCubeletCoords);
        } else {
            const coord = new Array<CubeletCoordinate>();
            coord.push(new CubeletCoordinate(0, 0, 0, 1, 1));
            coord.push(new CubeletCoordinate(1, 0, 0, 1, 1));
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
        this.backendStore.loadFile(data.filename);
    }
}