import { toFixed } from "../utilities/units";

export class Point3D {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    public static ToString(point: Point3D, unit: string, decimals: number = -1) {
        return point ? `(${decimals < 0 ? point.x : toFixed(point.x, decimals)} ${unit}, ${decimals < 0 ? point.y : toFixed(point.y, decimals)} ${unit}, ${decimals < 0 ? point.z : toFixed(point.z, decimals)} ${unit})` : "";
    }
}

export class WCSPoint3D {
    x: string = '';
    y: string = '';
    z: string = '';

    public static ToString(wcsPoint: WCSPoint3D) {
        return wcsPoint ? `(${wcsPoint.x}, ${wcsPoint.y}, ${wcsPoint.z})` : "";
    }
}