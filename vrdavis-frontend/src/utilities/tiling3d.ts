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
    // validate stuff
    
    // const layerXY = MipToLayerXY(cubeView.mipXY, fullCubeSize, cubeSize);
    // const layerZ = MipToLayerZ(cubeView.mipZ, fullCubeSize, cubeSize);
    // if (layerXY < 0) {
    //     return [new CubeletCoordinate(0, 0, 0, 0, 0)];
    // }

    // const boundedCubeView: CubeView = {
    //     xMin: Math.max(0, cubeState.xMin),
    //     xMax: Math.min(cubeState.xMax, fullCubeState.x),
    //     yMin: Math.max(0, cubeState.yMin),
    //     yMax: Math.min(cubeState.yMax, fullCubeState.y),
    //     zMin: Math.max(0, cubeState.zMin),
    //     zMax: Math.min(cubeState.zMax, fullCubeState.z),
    //     mipXY: cubeState.mipXY,
    //     mipZ: cubeState.mipZ
    // };
    const boundedCubeView: CubeView = {
        xMin: cubeState.xMin + cubeState.xMax,
        xMax: cubeState.xMax + cubeState.xMax,
        yMin: cubeState.yMin + cubeState.yMax,
        yMax: cubeState.yMax + cubeState.yMax,
        zMin: cubeState.zMin + cubeState.zMax,
        zMax: cubeState.zMax + cubeState.zMax,
        mipXY: cubeState.mipXY,
        mipZ: cubeState.mipZ
    };

    const adjustedCubeSize: Point3D = {
        x: cubeState.mipXY * cubeSize.x,
        y: cubeState.mipXY * cubeSize.y,
        z: cubeState.mipZ * cubeSize.z
    };

    // rounded method
    // const xStart = Math.ceil(boundedCubeView.xMin / cubeSize.x);
    // const xEnd = Math.floor(boundedCubeView.xMax / cubeSize.x);
    // const yStart = Math.ceil(boundedCubeView.yMin / cubeSize.y);
    // const yEnd = Math.floor(boundedCubeView.yMax / cubeSize.y);
    // const zStart = Math.ceil(boundedCubeView.zMin / cubeSize.z);
    // const zEnd = Math.floor(boundedCubeView.zMax / cubeSize.z);

    const xStart = Math.ceil(boundedCubeView.xMin / adjustedCubeSize.x);
    const xEnd = Math.floor(boundedCubeView.xMax / adjustedCubeSize.x);
    const yStart = Math.ceil(boundedCubeView.yMin / adjustedCubeSize.y);
    const yEnd = Math.floor(boundedCubeView.yMax / adjustedCubeSize.y);
    const zStart = Math.ceil(boundedCubeView.zMin / adjustedCubeSize.z);
    const zEnd = Math.floor(boundedCubeView.zMax / adjustedCubeSize.z);

    console.log(xStart + ' ' + xEnd);
    console.log(yStart + ' ' + yEnd);
    console.log(zStart + ' ' + zEnd);

    const numCubesX = xEnd - xStart;
    const numCubesY = yEnd - yStart;
    const numCubesZ = zEnd - zStart;

    console.log(numCubesX)
    console.log(numCubesY)
    console.log(numCubesZ)

    console.log(adjustedCubeSize)
    
    const cubeletSet: CubeletCoordinate[] = new Array<CubeletCoordinate>();
    for (let x = xStart; x < xEnd; x=x+cubeSize.x) {
        for (let y = yStart; y < yEnd; y=y+cubeSize.y) {
            for (let z = zStart; z < zEnd; z=z+cubeSize.z) {
                console.log(x + ' ' + y + ' ' + z)
                cubeletSet.push(new CubeletCoordinate(x, y, z, cubeState.mipXY, cubeState.mipZ));
            }
        }
    }
    return cubeletSet;
}