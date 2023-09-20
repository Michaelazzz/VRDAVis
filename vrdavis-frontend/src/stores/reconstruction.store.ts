import { makeAutoObservable, computed, action } from "mobx";
import { RootStore } from "./root.store";
import { CubeletCoordinate, Point3D } from "../models";
import { CUBELET_SIZE, Cubelet } from "./cubelet.store";

export class ReconstructionStore {
    rootStore: RootStore;

    cubelets: Map<string, Cubelet>;

    data: Float32Array;

    width: number;
    height: number;
    length:number;

    cubeUpdated: boolean;

    constructor (rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;

        this.cubelets = new Map<string, Cubelet>();

        this.data = new Float32Array();
        this.width = 0;
        this.height = 0;
        this.length = 0;

        this.cubeUpdated = false;
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
        console.log(`cube dims ${this.width} ${this.height} ${this.length}`);
        const data = new Float32Array(this.width*this.height*this.length);
        this.cubelets.forEach((cubelet, key, map) => {
            // this.addCubeToTexture(CubeletCoordinate.Decode(key), value);
            const coord = CubeletCoordinate.Decode(key);
            // add cubelet
            let n = 0;
            for(let l = cubelet.width*coord.z; l < cubelet.width*coord.z+cubelet.length; l++) {
                for(let k = cubelet.width*coord.y; k < cubelet.width*coord.y+cubelet.height; k++) {
                    for(let j = cubelet.width*coord.x; j < cubelet.width*coord.x+cubelet.width; j++) {
                        data[this.convertCoordToIndex(j, k, l)] = cubelet.data[n];
                        n++;
                    }
                }
            }
        });
        this.data = Float32Array.from(data);
    }

    addToTextureDimensions = (coord: CubeletCoordinate, cubelet: Cubelet) => {
        if(coord.x === 0 && cubelet.width === 0) this.width = cubelet.width;
        else if(((coord.x)*CUBELET_SIZE) >= this.width) this.width += cubelet.width;
        if(coord.y === 0 && cubelet.height === 0) this.height = cubelet.height;
        else if(((coord.y)*CUBELET_SIZE) >= this.height) this.height += cubelet.height;
        if(coord.z === 0 && cubelet.length === 0) this.length = cubelet.length;
        else if(((coord.z)*CUBELET_SIZE) >= this.length) this.length += cubelet.length;
    }

    getTextureDimensions = () => {
        this.cubelets.forEach((cubelet, key, map) => {
            const coord = CubeletCoordinate.Decode(key);
            if(coord.x === 0 && cubelet.width === 0) this.width = cubelet.width;
            else if(((coord.x)*CUBELET_SIZE) >= this.width) this.width += cubelet.width;
            if(coord.y === 0 && cubelet.height === 0) this.height = cubelet.height;
            else if(((coord.y)*CUBELET_SIZE) >= this.height) this.height += cubelet.height;
            if(coord.z === 0 && cubelet.length === 0) this.length = cubelet.length;
            else if(((coord.z)*CUBELET_SIZE) >= this.length) this.length += cubelet.length;
        });
        
    }

    hasData = (cubelet: Cubelet) => {
        for(let i = 0; i < cubelet.data.length; i++) {
            if(!Number.isNaN(cubelet.data[i]) && cubelet.data[i] > 0) return true;
        }
        return false;
    }

    convertCoordToIndex = (x: number, y: number, z: number) => {
        return x + this.height * (y + this.width* z);
        // alternative
        // (z * prevWidth * prevHeight) + (y * prevWidth) + x;
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
}