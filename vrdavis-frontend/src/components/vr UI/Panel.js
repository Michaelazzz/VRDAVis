import React, {useEffect, useRef} from "react";
import {extend, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json'
import FontImage from '../../assets/Roboto-msdf.png'

extend(ThreeMeshUI);

const Panel = (text) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = new ThreeMeshUI.Block( {
            width: 1.3,
            height: 0.5,
            padding: 0.05,
            justifyContent: 'center',
            textAlign: 'left',
            fontFamily: FontJSON,
            fontTexture: FontImage,
            // interLine: 0,
        } );
    
        mountRef.current.add( container );
    
        container.add(
            new ThreeMeshUI.Text( {
                content: 'hello from the UI',
                fontSize: 0.08
            } )
        );
    
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

export default Panel;
