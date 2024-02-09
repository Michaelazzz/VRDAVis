import { BackendStore } from "./backend.store";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z, CubeletStore } from "./cubelet.store";
import { FileStore } from "./file.store";
import { CubeStore } from "./cube.store";
import { SignallingStore } from "./signalling.store";
import { CubeView, CubeletCoordinate } from "../models";
import { GetRequiredCubelets } from "../utilities";
import { ReconstructionStore } from "./reconstruction.store";
import { StatsStore } from "./stats.store";

export class RootStore {

    backendStore: BackendStore;
    signallingStore: SignallingStore;
    cubeletStore: CubeletStore;
    fileStore: FileStore;
    cubeStore: CubeStore;
    reconstructionStore: ReconstructionStore;
    statsStore: StatsStore;

    constructor() {
        this.backendStore = new BackendStore(this);
        this.signallingStore = new SignallingStore(this);
        this.cubeletStore = new CubeletStore(this);
        this.fileStore = new FileStore(this);
        this.cubeStore = new CubeStore(this);
        this.reconstructionStore = new ReconstructionStore(this);
        this.statsStore = new StatsStore(this);
    }

    connectToServer = async (url: string) => {
        await this.backendStore.connectToServer(url);
    }

    connectToSignallingServer = async () => {
        await this.signallingStore.start();
    }

    cropCube = () => {
        this.reconstructionStore.resetCube();
        console.log('crop cube');
        // get the coordinates of the crop cube coords within the world cube dimensions
        const cubeCoords: CubeView = this.cubeStore.cropCubeToLocalCubeCoords;
        console.log(cubeCoords)
        this.backendStore.setRegion([cubeCoords.xMin, cubeCoords.xMax, cubeCoords.yMin, cubeCoords.yMax, cubeCoords.zMin, cubeCoords.zMax]);
        const cubelets = GetRequiredCubelets(cubeCoords);
        console.log(cubelets)
        
        // remember previous cube
        // this.cubeStore.setLocalCube()

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

    resumeState = (data: any) => {
        // set cube state
        this.cubeStore.setCubeState(
            data.cubeState.prevCenter, 
            data.cubeState.prevCube, 
            data.cubeState.cropCenter, 
            data.cubeState.cropCube
        );
        // load file
        this.backendStore.getFileInfo(data.filename);
        this.backendStore.loadFile(data.filename);
    }
}