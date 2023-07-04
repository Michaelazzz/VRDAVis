import { makeAutoObservable, computed } from "mobx";
import { RootStore } from "./root.store";
import { CubeletCoordinate, Point3D } from "../models";
import { CUBELET_SIZE, Cubelet } from "./cubelet.store";

export class ReconstructionStore {
    rootStore: RootStore;

    cubelets: CubeletCoordinate[] = [];

    data: Float32Array;

    width: number;
    height: number;
    length:number;

    cubeUpdated: boolean;

    constructor (rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;

        this.data = new Float32Array();
        this.width = 0;
        this.height = 0;
        this.length = 0;

        this.cubeUpdated = false;
    }

    setNewCubeDimensions() {
        const max = {x: 0, y: 0, z: 0};
        for(let i = 0; i < this.cubelets.length; i++) {
            const cubelet = this.cubelets[i];
            if(cubelet.x > max.x)
                max.x = cubelet.x;
            if(cubelet.y > max.y)
                max.y = cubelet.y;
            if(cubelet.z > max.z)
                max.z = cubelet.z;
        }
        // console.log(`${max.x} ${max.y} ${max.z}`);
        this.setDimensions((max.x+1)*CUBELET_SIZE, (max.y+1)*CUBELET_SIZE, (max.z+1)*CUBELET_SIZE);
    }

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

    setCubelets = (cubelets: CubeletCoordinate[]) => {
        this.cubelets = [...cubelets];
        this.setNewCubeDimensions()
        const data = new Float32Array(this.width*this.height*this.length);
        this.data = Float32Array.from(data);
    }

    // reconstructCube = () => {
    //     console.log('reconstruction in progress');

    //     // if there is only 1 cubelet it doesn't need to be reconstructed
    //     if(this.cubelets.length === 1) {
    //         const coord = this.cubelets[0].encode();
    //         const cubelet = this.rootStore.cubeletStore.getCubelet(coord, 0);
    //         if(!cubelet) return;
    //         this.setDimensions(cubelet.width || 0, cubelet.height || 0, cubelet.length || 0)
    //         if(cubelet.data != null && cubelet.data !== undefined)
    //             this.rootStore.reconstructionStore.setData(cubelet.data)
    //         return;
    //     }

    //     const data = new Float32Array(this.width*this.height*this.length);
    //     this.data = Float32Array.from(data);
    // }

    addCubeToTexture = (coord: CubeletCoordinate, cubelet: Cubelet) => {
        if(cubelet === undefined) return;
        this.cubeUpdated = false;
        console.log(`adding cubelet ${coord.encode()}`)
        const cubeletWidth = (coord.x+1)*cubelet.width;
        const cubeletHeight = (coord.y+1)*cubelet.height;
        const cubeletLength = (coord.z+1)*cubelet.length;
        const data = new Float32Array(this.data);
        let m = 0;
        console.log(`start: ${ coord.x*CUBELET_SIZE} => end: ${cubeletWidth}`)
        console.log(`start: ${ coord.y*CUBELET_SIZE} => end: ${cubeletHeight}`)
        console.log(`start: ${ coord.z*CUBELET_SIZE} => end: ${cubeletLength}`)
        
        for(let l = coord.z*CUBELET_SIZE; l < cubeletLength; l++) {
            for(let k = coord.y*CUBELET_SIZE; k < cubeletHeight; k++) {
                for(let j = coord.x*CUBELET_SIZE; j < cubeletWidth; j++) {
                    const widthIndex = j
                    const heightIndex = k * CUBELET_SIZE
                    const lengthIndex = l * CUBELET_SIZE * CUBELET_SIZE
                    const index = widthIndex + heightIndex + lengthIndex;
                    // data[index] = cubelet.data[m] === 0 ? 1 : cubelet.data[m];
                    data[index] = cubelet.data[m];
                    // this.setPoint(j+k+l, cubelet.data[m]);
                    m++;
                }
            }
        }
        this.rootStore.reconstructionStore.setData(data)
        // this.rootStore.reconstructionStore.setData(data)
        console.log(`cubelet ${coord.encode()} added`)
        this.cubeUpdated = true;
        console.log(this.data)
    }
}