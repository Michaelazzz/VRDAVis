export class Cubelet3DTexture {
    width: number;
    height: number;
    length: number;
    data: Float32Array;

    constructor(width: number, height: number, length: number, data: Float32Array) {
        this.width = width;
        this.height = height;
        this.length = length;
        this.data = new Float32Array();
    }
}