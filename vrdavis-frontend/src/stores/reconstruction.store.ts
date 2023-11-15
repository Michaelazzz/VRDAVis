import { makeAutoObservable } from "mobx";
import { RootStore } from "./root.store";
import { CubeletCoordinate} from "../models";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z, Cubelet } from "./cubelet.store";
import { workerScript } from "../utilities/reconstructionWorker"

export class ReconstructionStore {
    rootStore: RootStore;

    cubelets: Map<string, Cubelet>;

    data: Float32Array;

    width: number;
    height: number;
    length: number;

    rangeX: number[];
    rangeY: number[];
    rangeZ: number[];

    cubeUpdated: boolean;

    worker: Worker;

    constructor (rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;

        this.cubelets = new Map<string, Cubelet>();

        this.data = new Float32Array();
        this.width = 0;
        this.height = 0;
        this.length = 0;

        this.rangeX = [];
        this.rangeY = [];
        this.rangeZ = [];

        this.cubeUpdated = false;

        this.worker = new Worker(workerScript);
        this.worker.onmessage = (e: any) => {
            // console.log('Message from worker')
            this.data = Float32Array.from(e.data);
        }
    }

    // setNewCubeDimensions() {
    //     const max = {x: 0, y: 0, z: 0};
    //     for(let i = 0; i < this.cubelets.length; i++) {
    //         const cubelet = this.cubelets[i];
    //         if(cubelet.x > max.x)
    //             max.x = cubelet.x;
    //         if(cubelet.y > max.y)
    //             max.y = cubelet.y;
    //         if(cubelet.z > max.z)
    //             max.z = cubelet.z;
    //     }
    //     // this.setDimensions((max.x+1)*CUBELET_SIZE, (max.y+1)*CUBELET_SIZE, (max.z+1)*CUBELET_SIZE);
    //     this.setDimensions((max.x+1), (max.y+1), (max.z+1));
    //     this.setData(new Float32Array(this.width*this.height*this.length));
    // }

    setData = (data: Float32Array) => {
        if(data != null && data !== undefined)
            this.data = Float32Array.from(data);
    }
    setPoint = (index: number, data: number) => {
        this.data[index] = data;
        // console.log()
    }

    setDimensions = (width: number, height: number, length: number) => {
        this.width = width;
        this.height = height;
        this.length = length;
    }

    addCubelet = (key: string, cubelet: Cubelet) => {
        this.rootStore.reconstructionStore.cubelets.set(key, cubelet);
    }

    // setCubelets = (cubelets: CubeletCoordinate[]) => {
    //     this.cubelets = [...cubelets];
    // }

    // waits for all cubelets to arrive before constructing the texture
    reconstructCube = async () => {
        console.log('reconstruction in progress');
        this.getTextureDimensions();
        // let min = 1;
        // let max = 0;
        console.log(`cube dims ${this.width} ${this.height} ${this.length}`);
        console.log(`cube range ${this.rangeX} ${this.rangeY} ${this.rangeZ}`);
        const data = new Float32Array(this.width*this.height*this.length);
        this.cubelets.forEach((cubelet, key, map) => {
            // this.addCubeToTexture(CubeletCoordinate.Decode(key), value);
            const coord = CubeletCoordinate.Decode(key);
            // add cubelet
            let n = 0;
            console.log(`coord ${coord.x} ${coord.y} ${coord.z}`);
            console.log(`cubelet ${cubelet.width} ${cubelet.height} ${cubelet.length}`);
            let translatedX = 0;
            if (coord.x > 0) {
                if (this.rangeX[0] > 0 ) {
                    translatedX = coord.x - (this.rangeX[1] - this.rangeX[0]);
                } else {
                    translatedX = coord.x - this.rangeX[0];
                }
            }
            console.log(`x ${translatedX} -> from ${translatedX*CUBELET_SIZE_XY} to ${(translatedX*CUBELET_SIZE_XY)+cubelet.width}`);
            let translatedY = 0;
            if (coord.y > 0) {
                if (this.rangeY[0] > 0 ) {
                    translatedY = coord.y - (this.rangeY[1] - this.rangeY[0]);
                } else {
                    translatedY = coord.y - this.rangeY[0];
                }
            }
            console.log(`y ${translatedY} -> from ${translatedY*CUBELET_SIZE_XY} to ${(translatedY*CUBELET_SIZE_XY)+cubelet.height}`);
            let translatedZ = 0;
            if (coord.z > 0) {
                if (this.rangeZ[0] > 0 ) {
                    translatedZ = coord.z - (this.rangeZ[1] - this.rangeZ[0]);
                } else {
                    translatedZ = coord.z - this.rangeZ[0];
                }
            }
            console.log(`z ${translatedZ} -> from ${translatedZ*CUBELET_SIZE_Z} to ${(translatedZ*CUBELET_SIZE_Z)+cubelet.length}`)
            for(let l = translatedZ*CUBELET_SIZE_Z; l < (translatedZ*CUBELET_SIZE_Z)+cubelet.length; l++) {
                for(let k = translatedY*CUBELET_SIZE_XY; k < (translatedY*CUBELET_SIZE_XY)+cubelet.height; k++) {
                    for(let j = translatedX*CUBELET_SIZE_XY; j < (translatedX*CUBELET_SIZE_XY)+cubelet.width; j++) {
                        data[this.convertCoordToIndex(j, k, l)] = cubelet.data[n];
                        // if(cubelet.data[n] < min) min = cubelet.data[n];
                        // if(cubelet.data[n] > max) max = cubelet.data[n];
                        n++;
                    }
                }
            }
            // this.data = Float32Array.from(cubelet.data);
        });
        // fit data within range 0 - 1
        // const normalised = new Float32Array(this.width*this.height*this.length);
        // for (let index = 0; index < data.length; index++) {
        //     normalised[index] = (data[index] - min) / (max - min);
        // }
        // this.data = Float32Array.from(normalised);
        this.data = Float32Array.from(data);
    }

    reconstructCubeWithWorker = async () => {
        console.log('reconstruction in progress');
        this.getTextureDimensions();
        console.log(`cube dims ${this.width} ${this.height} ${this.length}`);

        const indexArr = new Array(this.cubelets.size);
        const dataArr = new Array(this.cubelets.size);
        const widthArr = new Array(this.cubelets.size);
        const heightArr = new Array(this.cubelets.size);
        const lengthArr = new Array(this.cubelets.size);
        let i = 0;
        
        this.cubelets.forEach((cubelet, key, map) => {
            indexArr[i] = key;
            dataArr[i] = cubelet.data;
            widthArr[i] = cubelet.width;
            heightArr[i] = cubelet.height;
            lengthArr[i] = cubelet.length;
            i++;
        })

        this.worker.postMessage([
            this.width, 
            this.height, 
            this.length, 
            indexArr, 
            dataArr, 
            widthArr, 
            heightArr, 
            lengthArr, 
            CUBELET_SIZE_XY, 
            CUBELET_SIZE_Z,
            [this.rangeX[0], this.rangeX[1]],
            [this.rangeY[0], this.rangeY[1]],
            [this.rangeZ[0], this.rangeZ[1]]
        ]);
    }

    addToTextureDimensions = (coord: CubeletCoordinate, cubelet: Cubelet) => {
        if(coord.x === 0 && cubelet.width === 0) this.width = cubelet.width;
        else if(((coord.x)*CUBELET_SIZE_XY) >= this.width) this.width += cubelet.width;
        if(coord.y === 0 && cubelet.height === 0) this.height = cubelet.height;
        else if(((coord.y)*CUBELET_SIZE_XY) >= this.height) this.height += cubelet.height;
        if(coord.z === 0 && cubelet.length === 0) this.length = cubelet.length;
        else if(((coord.z)*CUBELET_SIZE_Z) >= this.length) this.length += cubelet.length;
    }

    getTextureDimensions = () => {
        let xMin = -1;
        let xMax = -1;
        let yMin = -1;
        let yMax = -1;
        let zMin = -1;
        let zMax = -1;
        this.cubelets.forEach((cubelet, key, map) => {
            const coord = CubeletCoordinate.Decode(key);
            if(xMin === -1 || xMax === -1) { xMin = coord.x; xMax = coord.x; this.width = cubelet.width }
            else if(coord.x < xMin) { xMin = coord.x; this.width += cubelet.width; }
            else if(coord.x > xMax) { xMax = coord.x; this.width += cubelet.width; }
            if(yMin === -1 || yMax === -1) { yMin = coord.y; yMax = coord.y; this.height = cubelet.height }
            else if(coord.y < yMin) { yMin = coord.y; this.height += cubelet.height; }
            else if(coord.y > yMax) { yMax = coord.y; this.height += cubelet.height }
            if(zMin === -1 || zMax === -1) { zMin = coord.z; zMax = coord.z; this.length = cubelet.length }
            else if(coord.z < zMin) { zMin = coord.z; this.length += cubelet.length; }
            else if(coord.z > zMax) { zMax = coord.z; this.length += cubelet.length; }
        });
        this.rangeX[0] = xMin;
        this.rangeX[1] = xMax;
        this.rangeY[0] = yMin;
        this.rangeY[1] = yMax;
        this.rangeZ[0] = zMin;
        this.rangeZ[1] = zMax;
    }

    hasData = (cubelet: Cubelet) => {
        for(let i = 0; i < cubelet.data.length; i++) {
            if(!Number.isNaN(cubelet.data[i]) && cubelet.data[i] > 0) return true;
        }
        return false;
    }

    convertCoordToIndex = (x: number, y: number, z: number) => {
        // return x + this.height * (y + this.width* z);
        return x + (y*this.width) + (z * this.width * this.height);
    }

    // resizes data cube and adds new cubelet to the texture
    addCubeToTexture = (coord: CubeletCoordinate, cubelet: Cubelet) => {
        if(cubelet === undefined) return;
        this.cubeUpdated = false;
        console.log(`adding cubelet ${coord.encode()}`);
        console.log(`start ${cubelet.width*coord.x} ${cubelet.height*coord.y} ${cubelet.length*coord.z}`);
        // console.log(`Contains data: ${this.hasData(cubelet)}`);
        console.log(`previous dims ${this.width} ${this.height} ${this.length}`);
        let prevWidth = this.width;
        let prevHeight = this.height;
        let prevLength = this.length;
        // expand cube dimensions to accomidate new cubelet
        this.addToTextureDimensions(coord, cubelet);
        console.log(`cube dims ${this.width} ${this.height} ${this.length}`);
        console.log(`cubelet dims ${cubelet.width} ${cubelet.height} ${cubelet.length}`)

        const data = new Float32Array(this.width*this.height*this.length);
        
        // put old data into new array
        // expand array
        let m = 0;
        for(let l = 0; l < prevLength; l++) {
            for(let k = 0; k < prevHeight; k++) {
                for(let j = 0; j < prevWidth; j++) {
                    data[this.convertCoordToIndex(j, k, l)] = this.data[m];
                    m++;
                }
            }
        }
        
        this.data = Float32Array.from(data);
        console.log(this.data);
        console.log(`cubelet ${coord.encode()} added`)
        this.cubeUpdated = true;
    }

    resetCube = () => {
        this.cubelets.clear();

        this.data = new Float32Array();

        this.width = 0;
        this.height = 0;
        this.length = 0;

        this.rangeX = [];
        this.rangeY = [];
        this.rangeZ = [];
    }

    downsizeData = () => {
        console.log('downsizing in progress');
        this.width = Math.floor(this.width/2);
        this.length = Math.floor(this.length/2);
        this.height = Math.floor(this.height/2);

        const data = new Float32Array(this.width*this.height*this.length);
        let count = 0;
        for(let i = 0; i < this.data.length; i++) {
            if(i % 2 === 0) {
                data[count] = this.data[i];
                count++;
            }
        }

        this.data = Float32Array.from(data);
    }
}