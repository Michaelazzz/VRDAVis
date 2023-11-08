import { useContext, useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react";

import * as THREE from 'three';
import { RootContext } from "../store.context";

const BoundsCubeView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    const scaleFactor = 0.05;
    const width = rootStore.reconstructionStore.width*scaleFactor;
    const height = rootStore.reconstructionStore.height*scaleFactor;
    const length = rootStore.reconstructionStore.length*scaleFactor;

    const mesh = useRef<THREE.Mesh>();

    const geometryCube = useMemo(() => new THREE.BoxGeometry( width, height, length ), [width, height, length]);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry( geometryCube ), [geometryCube]);
    const materialCube = useMemo(() => new THREE.LineBasicMaterial({
        color: 0xFF0000,
        fog: false,
        linewidth: 1, // 1 regardless of set value
        linecap: 'round',
        linejoin: 'round'
    }), []);

    const edges = useMemo(() => new THREE.LineSegments( edgesGeometry, materialCube ), [edgesGeometry, materialCube]);

    useEffect(() => {
        if(!mesh.current)
            return;
        mesh.current.add(edges);
    }, [edges]);

    return (
        <mesh 
            // @ts-ignore
            ref={mesh}
        ></mesh>
    )
}

const BoundsCube = observer(BoundsCubeView);
export { BoundsCube };