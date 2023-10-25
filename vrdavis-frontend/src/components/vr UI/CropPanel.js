import React, {useEffect, useRef, useContext, useMemo} from "react";
import {extend, useFrame} from "@react-three/fiber";
import { RootContext } from "../../store.context";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json'
import FontImage from '../../assets/Roboto-msdf.png'

import { observer } from 'mobx-react';

extend(ThreeMeshUI);

const CropPanelView = (text) => {
    const mountRef = useRef(null);
    const { rootStore } = useContext(RootContext);

    const container = useMemo(() => new ThreeMeshUI.Block({
        ref: "container",
        padding: 0.025,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontColor: new THREE.Color(0x333333),
        backgroundOpacity: 0
    }), []);
    
    // container.position.set(0, 1, -1.8);

    // const title = new ThreeMeshUI.Block({
    //     height: 0.1,
    //     width: 1,
    //     margin: 0.01,
    //     justifyContent: "center",
    //     fontSize: 0.05,
    //     backgroundColor: new THREE.Color(0xffffff),
    // });

    // title.add(
    //     new ThreeMeshUI.Text({
    //         content: "Controls",
    //     })
    // );

    // container.add(title);

    const leftSubBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 0.5,
        margin: 0.01,
        padding: 0.025,
        textAlign: "left",
        justifyContent: "end",
        backgroundColor: new THREE.Color(0xffffff)
    });

    const steps = useMemo(() => new ThreeMeshUI.Block({
        height: 0.07,
        width: 0.37,
        margin: 0.01,
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: new THREE.Color(0xffffff)
    }).add(new ThreeMeshUI.Text({
        content: `Steps: ${String(rootStore.cubeStore.steps)}`,
        fontSize: 0.04,
    })), [rootStore.cubeStore.steps]);

    const caption = new ThreeMeshUI.Block({
        height: 0.07,
        width: 0.37,
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: new THREE.Color(0xffffff)
    });

    caption.add(
        new ThreeMeshUI.Text({
            content: "Some analytics",
            fontSize: 0.04,
        })
    );
    
    leftSubBlock.add(steps, caption);

    const rightSubBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 0.5,
        margin: 0.01,
        padding: 0.025,
        textAlign: "center",
        justifyContent: "start",
        backgroundColor: new THREE.Color(0xffffff)
    }).add(
        new ThreeMeshUI.Text({
            content: "Crop Data Cube",
        }));

    const contentContainer = new ThreeMeshUI.Block({
        contentDirection: "row",
        padding: 0.02,
        margin: 0.01,
        backgroundOpacity: 0
    });

    contentContainer.add(leftSubBlock, rightSubBlock);
    container.add(contentContainer);

    
    useEffect(() => {
        
        steps.clear();
        mountRef.current.add( container );

        // container.onAfterUpdate = function () {
        //     if( !container.lines ) return;
    
        //     var plane = new THREE.Mesh(
        //         new THREE.PlaneGeometry(container.lines.width, container.lines.height ),
        //         new THREE.MeshBasicMaterial({color:0xffffff})
        //     );
    
        //     plane.position.x = container.lines.x;
        //     plane.position.y = container.lines.height/2 - container.getInterLine()/2;
    
        //     const INNER_HEIGHT = container.getHeight() - ( container.padding * 2 || 0 );
    
        //     if( container.getJustifyContent() === 'start' ){
        //         plane.position.y = (INNER_HEIGHT/2) - container.lines.height/2;
        //     }else if( container.getJustifyContent() === 'center'){
        //         plane.position.y = 0;
        //     }else{
        //         plane.position.y = -(INNER_HEIGHT/2) + container.lines.height/2
        //     }
    
        //     // this.frame.layers.set( steps );
        //     container.add( plane );
        // }
    }, [container, steps, rootStore.cubeStore, rootStore.cubeStore.steps])

    useFrame(() => {
        ThreeMeshUI.update();
    });

    return (
        <block ref={mountRef}>
        </block>
    );
}

const CropPanel = observer(CropPanelView);
export { CropPanel };
