import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useController, useXREvent } from '@react-three/xr';
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';

import { VolumeShader } from '../shaders/VolumeShader';
import createColormap from 'colormap';
import { RootContext } from '../store.context';
import { observer } from 'mobx-react';

const DataCubeView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    // const backendStore = rootStore.backendStore;
    const reconstructionStore = rootStore.reconstructionStore;
    const data = reconstructionStore.data;
    const width = reconstructionStore.width;
    const height = reconstructionStore.height;
    const length = reconstructionStore.length;

    const ref = useRef<THREE.Mesh>();

    let cmData = useMemo(() => {
        const cmArray = new Float32Array(100*4);
        let cm = createColormap({
            colormap: 'jet',
            nshades: 100,
            format: 'float',
            alpha: 1
        });
        for(let i=0; i<100; i++){
            const stride = i * 4;
            cmArray[stride] = cm[i][0];
            cmArray[stride+1] = cm[i][1];
            cmArray[stride+2] = cm[i][2];
            cmArray[stride+3] = cm[i][3];
        }
        return cmArray;
    }, []);

    let geometry = useMemo(() => new THREE.BoxGeometry(width, height, length), [width, length, height]);
    // let geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

    // @ts-ignore
    let texture: THREE.Data3DTexture = useMemo(() => {
        console.log('texture updated')
        // console.log(`${data.length} with ${data.byteLength} byte length`)
        // console.log(`${width} ${height} ${length}`)
        return new THREE.Data3DTexture(data, width, height, length)
    }, [data, width, height, length]);
    texture.format = THREE.RedFormat;
    texture.type = THREE.FloatType;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    let colormap: THREE.DataTexture = useMemo(() => 
        new THREE.DataTexture(cmData, 100, 1)
    , [cmData]);
    colormap.type = THREE.FloatType;
    colormap.needsUpdate = true;
    
    let material: THREE.ShaderMaterial = useMemo(() => { 
        console.log('material updated')
        return new THREE.ShaderMaterial({
            uniforms: {                                            
                u_textureData: { value: texture },
                // u_threshold: { value: 0.25 },
                // u_range: { value: 0.1 },
                // u_steps: { value: 100 },
                u_colourMap: { value: colormap },
                // map: { value: texture },
                // cameraPos: { value: new THREE.Vector3() }
            },
            vertexShader: VolumeShader.vertexShader,
            fragmentShader: VolumeShader.fradgmentShader,
            side: THREE.BackSide,
            transparent: true
        })
    }, [colormap, texture]);

    let dataCube: THREE.Mesh = useMemo(() => 
        new THREE.Mesh(geometry, material), 
    [geometry, material]);
    dataCube.frustumCulled = false;

    useEffect(() => {
        if(!ref.current)
            return;
        ref.current.add(dataCube);
    }, [dataCube]);

    return (
        <group 
            // @ts-ignore
            ref={ref}
            position={[0,1.5,-1.5]}
        ></group>
    )
};

const DataCube = observer(DataCubeView);
export { DataCube };