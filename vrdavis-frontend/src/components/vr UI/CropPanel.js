import React, {useEffect, useRef, useContext} from "react";
import {extend, useFrame} from "@react-three/fiber";
import { RootContext } from "../../store.context";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json'
import FontImage from '../../assets/Roboto-msdf.png'

extend(ThreeMeshUI);

const CropPanel = (text) => {
    const mountRef = useRef(null);
    const { rootStore } = useContext(RootContext);

    useEffect(() => {
        const container = new ThreeMeshUI.Block({
            ref: "container",
            padding: 0.025,
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontColor: new THREE.Color(0x333333),
            backgroundOpacity: 0
        });
        
        // container.position.set(0, 1, -1.8);
    
        mountRef.current.add( container );
    
        const title = new ThreeMeshUI.Block({
            height: 0.1,
            width: 1,
            margin: 0.01,
            justifyContent: "center",
            fontSize: 0.05,
            backgroundColor: new THREE.Color(0xffffff),
        });
    
        title.add(
            new ThreeMeshUI.Text({
                content: "Controls",
            })
        );
    
        container.add(title);

        const leftSubBlock = new ThreeMeshUI.Block({
            height: 0.4,
            width: 0.5,
            margin: 0.01,
            padding: 0.025,
            textAlign: "left",
            justifyContent: "end",
            backgroundColor: new THREE.Color(0xffffff)
        });

        const steps = new ThreeMeshUI.Block({
            height: 0.07,
            width: 0.37,
            margin: 0.01,
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: new THREE.Color(0xffffff)
        });
        
        steps.add(
            new ThreeMeshUI.Text({
                content: `Steps: ${String(rootStore.cubeStore.getSteps())}`,
                fontSize: 0.04,
            })
        );

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
        
        // const subSubBlock1 = new ThreeMeshUI.Block({
        //     height: 0.4,
        //     width: 0.5,
        //     margin: 0.01,
        //     padding: 0.02,
        //     fontSize: 0.04,
        //     justifyContent: "center",
        //     backgroundOpacity: 0,
        // }).add(
        //     new ThreeMeshUI.Text({
        //         content: "Crop Data Cube",
        //     }),
        
            // new ThreeMeshUI.Text({
            //     content: "bristly",
            //     fontColor: new THREE.Color(0x92e66c),
            // }),
        
            // new ThreeMeshUI.Text({
            //     content: " appearance.",
            // })
        // );
        
        // const subSubBlock2 = new ThreeMeshUI.Block({
        //     height: 0.1,
        //     width: 0.5,
        //     margin: 0.01,
        //     padding: 0.02,
        //     fontSize: 0.025,
        //     alignItems: "start",
        //     textAlign: 'justify',
        //     backgroundOpacity: 0,
        // }).add(
        //     new ThreeMeshUI.Text({
        //         content: "Crop instructions go here maybe",
        //     })
        // );
        
        // rightSubBlock.add(subSubBlock1, subSubBlock2);

        const contentContainer = new ThreeMeshUI.Block({
            contentDirection: "row",
            padding: 0.02,
            margin: 0.01,
            backgroundOpacity: 0
        });
    
        contentContainer.add(leftSubBlock, rightSubBlock);
        container.add(contentContainer);

    
        return container.onAfterUpdate = function (){
            if( !container.lines ) return;
    
            var plane = new THREE.Mesh(
                new THREE.PlaneGeometry(container.lines.width, container.lines.height ),
                new THREE.MeshBasicMaterial({color:0xff9900})
            );
    
            plane.position.x = container.lines.x;
            plane.position.y = container.lines.height/2 - container.getInterLine()/2;
    
            const INNER_HEIGHT = container.getHeight() - ( container.padding * 2 || 0 );
    
            if( container.getJustifyContent() === 'start' ){
                plane.position.y = (INNER_HEIGHT/2) - container.lines.height/2;
            }else if( container.getJustifyContent() === 'center'){
                plane.position.y = 0;
            }else{
                plane.position.y = -(INNER_HEIGHT/2) + container.lines.height/2
            }
    
            container.add( plane );

            return container.onAfterUpdate = function () {
                steps.set({
                    content: `Steps: ${String(rootStore.cubeStore.getSteps())}`
                })
            }
        }
    }, [text, rootStore.cubeStore, rootStore.cubeStore.steps])

    useFrame(() => {
        // requestAnimationFrame( animate );
        ThreeMeshUI.update();
    });

    return (
        <block ref={mountRef}>
        </block>
    );
}

export default CropPanel;
