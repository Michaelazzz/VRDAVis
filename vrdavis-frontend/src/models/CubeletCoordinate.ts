export class CubeletCoordinate {
    // private static readonly FileIdOffset = 2 ** 32;

    layerXY: number;
    layerZ: number;
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number, layerXY: number, layerZ: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.layerXY = layerXY;
        this.layerZ = layerZ;
    }

    public encode(): string {
        return CubeletCoordinate.EncodeCoordinate(this);
    }

    public static EncodeCoordinate(coordinate: {x: number; y: number; z: number; layerXY: number; layerZ: number}): string {
        if (!coordinate) {
            return '';
        }
        return CubeletCoordinate.EncodeString(coordinate.x, coordinate.y, coordinate.z, coordinate.layerXY, coordinate.layerZ);
    }

    public static AddFileId(encodedCoordinate: string, fileId: number) {
        return encodedCoordinate + '_' + fileId;
    }

    // public static RemoveFileId(encodedCoordinate: number) {
    //     return encodedCoordinate % CubeletCoordinate.FileIdOffset;
    // }

    // Encoding a tile combines x, y, z, and layer coordinates into a single number. This makes it more efficient
    // to transfer a list of tiles to the backend, but also simplifies using the coordinate as a map key.
    // 12 bits are used for each of the x, y, and z coordinates (range of 0 - 4096), 7 bits for the layer.
    // The layer is limited to a range of 0 - 12, due to the range of the x, y, and z coordinates
    // public static Encode(x: number, y: number, z: number, layer: number): number {
    //     const layerWidth = 1 << layer;
    //     // check bounds
    //     if (x < 0 || y < 0 || z < 0 || layer < 0 || layer > 12 || x >= layerWidth || y >= layerWidth || z >= layerWidth) {
    //         return -1;
    //     }

    //     // encode using bitwise operators
    //     return (layer << 36) | (z << 24) | (y << 12) | x;
    // }

    public static EncodeString(x: number, y: number, z: number, layerXY: number, layerZ: number): string {
        return x + '_' + y + '_' + z + '_' + layerXY + '_' + layerZ;
    }

    // Decode all three coordinates from an encoded coordinate using bitwise operators
    // public static Decode(encodedCoordinate: number): CubeletCoordinate {
    //     const x = encodedCoordinate & 4095;
    //     const layer = (encodedCoordinate >> 36) & 127;
    //     const y = (encodedCoordinate >> 12) & 4095;
    //     const z = (encodedCoordinate >> 24) & 4095;
    //     return new CubeletCoordinate(x, y, z, layer);
    // }

    public static Decode(encodedCoordinate: string): CubeletCoordinate {
        const coord = encodedCoordinate.split('_');
        const x = Number(coord[0]);
        const y = Number(coord[1]);
        const z = Number(coord[2]);
        const mipXY = Number(coord[3]);
        const mipZ = Number(coord[4]);
        return new CubeletCoordinate(x, y, z, mipXY, mipZ);
    }

    // Shortcut to quickly decode just the layer from an encoded coordinate
    // public static GetLayer(encodedCoordinate: number): number {
    //     return (encodedCoordinate >> 36) & 127;
    // }

    public static GetFileId(encodedCoordinate: string): number {
        const coord = encodedCoordinate.split('_');
        const fileId = Number(coord[5]);
        return fileId;
    }
}