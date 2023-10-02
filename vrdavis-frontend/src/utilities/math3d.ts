import { Point3D } from "../models";

export const add3D = (a: Point3D, b: Point3D): Point3D => {
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
}

export const subtract3D = (a: Point3D, b: Point3D): Point3D => {
    return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
}

export const minMax3D = (points: Point3D[]): {maxPoint: Point3D; minPoint: Point3D} => {
    let maxPoint = {x: -Number.MAX_VALUE, y: -Number.MAX_VALUE, z: -Number.MAX_VALUE};
    let minPoint = {x: Number.MAX_VALUE, y: Number.MAX_VALUE, z: Number.MAX_VALUE};

    for (const point of points) {
        if (!point || isNaN(point.x) || isNaN(point.y) || isNaN(point.z)) {
            continue;
        }
        maxPoint.x = Math.max(maxPoint.x, point.x);
        maxPoint.y = Math.max(maxPoint.y, point.y);
        maxPoint.z = Math.max(maxPoint.z, point.z);
        minPoint.x = Math.min(minPoint.x, point.x);
        minPoint.y = Math.min(minPoint.y, point.y);
        minPoint.z = Math.min(minPoint.z, point.z);
    }
    return {maxPoint, minPoint};
}