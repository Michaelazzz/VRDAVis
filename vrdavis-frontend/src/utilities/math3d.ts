import { Point3D } from "../models";

export const add3D = (a: Point3D, b: Point3D): Point3D => {
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
}

export const subtract3D = (a: Point3D, b: Point3D): Point3D => {
    return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
}