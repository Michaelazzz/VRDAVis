import { CubeletCoordinate, CubeView, Point3D  } from "../models";

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

export function GetRequiredCubelets(cubeState: CubeView, fullCubeState: Point3D, cubeSize: Point3D): CubeletCoordinate[] {
    const xStart = Math.ceil(cubeState.xMin / cubeState.mipXY);
    const xEnd = Math.floor(cubeState.xMax / cubeState.mipXY);
    const yStart = Math.ceil(cubeState.yMin / cubeState.mipXY);
    const yEnd = Math.floor(cubeState.yMax / cubeState.mipXY);
    const zStart = Math.ceil(cubeState.zMin / cubeState.mipZ);
    const zEnd = Math.floor(cubeState.zMax / cubeState.mipZ);

    const cubeletSet: CubeletCoordinate[] = new Array<CubeletCoordinate>();
    for (let x = xStart; x <= xEnd; x=x+cubeSize.x) {
        for (let y = yStart; y <= yEnd; y=y+cubeSize.y) {
            for (let z = zStart; z <= zEnd; z=z+cubeSize.z) {
                // console.log(Math.floor(x/cubeSize.x) + ' ' + Math.floor(y/cubeSize.y) + ' ' + Math.floor(z/cubeSize.z))
                cubeletSet.push(new CubeletCoordinate(Math.floor(x/cubeSize.x), Math.floor(y/cubeSize.y), Math.floor(z/cubeSize.z), cubeState.mipXY, cubeState.mipZ));
            }
        }
    }

    return cubeletSet;
}