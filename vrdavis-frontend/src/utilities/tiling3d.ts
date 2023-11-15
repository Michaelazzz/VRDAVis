import { CubeletCoordinate, CubeView, Point3D  } from "../models";
import { CUBELET_SIZE_XY, CUBELET_SIZE_Z } from "../stores/cubelet.store";

export function CubeSort(a: CubeletCoordinate, b: CubeletCoordinate) {
    // if (a.layer !== b.layer) {
    //     return a.layer - b.layer;
    // } else if (a.x !== b.x) {
    //     return a.x - b.x;
    // } else if (a.y !== b.y) {
    //     return a.y - b.y;
    // } else {
    //     return a.z - b.z;
    // }
}

// Comparison function which compares cube coordinates based on their encoded coordinate.
// This is equivalent to sorting first by layer, then by z and y coordinate, and finally by x
export function TileSortEncoded(a: CubeletCoordinate, b: CubeletCoordinate) {
    // return CubeletCoordinate.EncodeCoordinate(a) - CubeletCoordinate.EncodeCoordinate(b);
}

// Converts from downsampling factor (MIP) to the tile layer using conventional tiling coordinates
export function MipToLayerXY(mip: number, cubeSize: Point3D, cubeletSize: Point3D): number {
    const totalCubeletsX = Math.ceil(cubeSize.x / cubeletSize.x);
    const totalCubeletsY = Math.ceil(cubeSize.y / cubeletSize.y);
    const maxXYMip = Math.max(totalCubeletsX, totalCubeletsY);
    const totalLayers = Math.ceil(Math.log2(maxXYMip));
    return totalLayers - Math.ceil(Math.log2(mip));
}

export function MipToLayerZ(mip: number, cubeSize: Point3D, cubeletSize: Point3D): number {
    const totalCubeletsZ = Math.ceil(cubeSize.z / cubeletSize.z);
    const totalLayers = Math.ceil(Math.log2(totalCubeletsZ));
    return totalLayers - Math.ceil(Math.log2(mip));
}

// Converts from tile layer using conventional tiling coordinates to the appropriate downsampling factor (MIP)
export function LayerToMip(layer: number, fullCubeSize: Point3D, cubeSize: Point3D): number {
    const totalTilesX = Math.ceil(fullCubeSize.x / cubeSize.x);
    const totalTilesY = Math.ceil(fullCubeSize.y / cubeSize.y);
    const totalTilesZ = Math.ceil(fullCubeSize.z / cubeSize.z);
    const maxMip = Math.max(totalTilesX, totalTilesY, totalTilesZ);
    const totalLayers = Math.ceil(Math.log2(maxMip));
    return Math.pow(2.0, totalLayers - layer);
}

export function GetRequiredCubelets(cubeState: CubeView): CubeletCoordinate[] {
    // round to nearest cubelet boundary
    const xStart = Math.floor((cubeState.xMin / cubeState.mipXY) / CUBELET_SIZE_XY) * CUBELET_SIZE_XY;
    const xEnd = Math.ceil((cubeState.xMax / cubeState.mipXY) / CUBELET_SIZE_XY) * CUBELET_SIZE_XY;
    const yStart = Math.floor((cubeState.yMin / cubeState.mipXY) / CUBELET_SIZE_XY) * CUBELET_SIZE_XY;
    const yEnd = Math.ceil((cubeState.yMax / cubeState.mipXY) / CUBELET_SIZE_XY) * CUBELET_SIZE_XY;
    const zStart = Math.floor((cubeState.zMin / cubeState.mipZ) / CUBELET_SIZE_Z) * CUBELET_SIZE_Z;
    const zEnd = Math.ceil((cubeState.zMax / cubeState.mipZ) / CUBELET_SIZE_Z) * CUBELET_SIZE_Z;

    // console.log(`${xStart} ${xEnd}`)
    // console.log(`${yStart} ${yEnd}`)
    // console.log(`${zStart} ${zEnd}`)

    const cubeletSet: CubeletCoordinate[] = new Array<CubeletCoordinate>();
    for (let x = xStart; x < xEnd; x=x+CUBELET_SIZE_XY) {
        for (let y = yStart; y < yEnd; y=y+CUBELET_SIZE_XY) {
            for (let z = zStart; z < zEnd; z=z+CUBELET_SIZE_Z) {
                // console.log(Math.floor(x) + ' ' + Math.floor(y) + ' ' + Math.floor(z))
                cubeletSet.push(new CubeletCoordinate(Math.floor(x/CUBELET_SIZE_XY), Math.floor(y/CUBELET_SIZE_XY), Math.floor(z/CUBELET_SIZE_Z), cubeState.mipXY, cubeState.mipZ));
            }
        }
    }

    return cubeletSet;
}