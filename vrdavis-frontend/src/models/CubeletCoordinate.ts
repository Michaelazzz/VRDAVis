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

    public static EncodeString(x: number, y: number, z: number, layerXY: number, layerZ: number): string {
        return x + '_' + y + '_' + z + '_' + layerXY + '_' + layerZ;
    }

    public static Decode(encodedCoordinate: string): CubeletCoordinate {
        const coord = encodedCoordinate.split('_');
        const x = Number(coord[0]);
        const y = Number(coord[1]);
        const z = Number(coord[2]);
        const mipXY = Number(coord[3]);
        const mipZ = Number(coord[4]);
        return new CubeletCoordinate(x, y, z, mipXY, mipZ);
    }

    public static GetFileId(encodedCoordinate: string): number {
        const coord = encodedCoordinate.split('_');
        const fileId = Number(coord[5]);
        return fileId;
    }
}