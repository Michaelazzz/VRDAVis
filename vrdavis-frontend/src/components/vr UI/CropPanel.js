import React, {useEffect, useRef} from "react";
import {extend, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json'
import FontImage from '../../assets/Roboto-msdf.png'

extend(ThreeMeshUI);

const CropPanel = (text) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = new ThreeMeshUI.Block({
            ref: "container",
            padding: 0.025,
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0,
          });
        
        // container.position.set(0, 1, -1.8);
    
        mountRef.current.add( container );
    
        const title = new ThreeMeshUI.Block({
            height: 0.2,
            width: 1.5,
            margin: 0.025,
            justifyContent: "center",
            fontSize: 0.09,
        });
    
        title.add(
            new ThreeMeshUI.Text({
                content: "Crop Controls",
            })
        );
    
        container.add(title);

        const leftSubBlock = new ThreeMeshUI.Block({
            height: 0.95,
            width: 1.0,
            margin: 0.025,
            padding: 0.025,
            textAlign: "left",
            justifyContent: "end",
        });
        
        const caption = new ThreeMeshUI.Block({
            height: 0.07,
            width: 0.37,
            textAlign: "center",
            justifyContent: "center",
        });
        
        caption.add(
            new ThreeMeshUI.Text({
                content: "Mind your fingers",
                fontSize: 0.04,
            })
        );
        
        leftSubBlock.add(caption);

        const rightSubBlock = new ThreeMeshUI.Block({
            margin: 0.025,
        });
        
        const subSubBlock1 = new ThreeMeshUI.Block({
            height: 0.35,
            width: 0.5,
            margin: 0.025,
            padding: 0.02,
            fontSize: 0.04,
            justifyContent: "center",
            backgroundOpacity: 0,
        }).add(
            new ThreeMeshUI.Text({
                content: "Crop Data Cube",
            }),
        
            // new ThreeMeshUI.Text({
            //     content: "bristly",
            //     fontColor: new THREE.Color(0x92e66c),
            // }),
        
            // new ThreeMeshUI.Text({
            //     content: " appearance.",
            // })
        );
        
        const subSubBlock2 = new ThreeMeshUI.Block({
            height: 0.53,
            width: 0.5,
            margin: 0.01,
            padding: 0.02,
            fontSize: 0.025,
            alignItems: "start",
            textAlign: 'justify',
            backgroundOpacity: 0,
        }).add(
            new ThreeMeshUI.Text({
                content: "Crop instructions go here maybe",
            })
        );
        
        rightSubBlock.add(subSubBlock1, subSubBlock2);

        const contentContainer = new ThreeMeshUI.Block({
            contentDirection: "row",
            padding: 0.02,
            margin: 0.025,
            backgroundOpacity: 0,
        });
    
        contentContainer.add(leftSubBlock, rightSubBlock);
        container.add(contentContainer);

    
        return container.onAfterUpdate = function (){
            
            // console.log( container.lines );
    
            if( !container.lines ) return;
    
            // console.log("lines", container.lines);
    
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
        }
    }, [text])

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
