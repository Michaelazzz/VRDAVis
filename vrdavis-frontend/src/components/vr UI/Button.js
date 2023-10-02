import React, { useEffect, useMemo, useRef, useState } from "react";
import { useController, useInteraction } from "@react-three/xr";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json';
import FontImage from '../../assets/Roboto-msdf.png';

extend(ThreeMeshUI)

const Button = ({position=[0,0], text='Click', onSelect = () => console.log({text})}) => {

    const buttonRef = useRef();
    const [hover, setHover] = useState(false);
    const [selected, setSelected] = useState(false);

    const selectedAttributes = useMemo(() => {
        return {
            // offset: 0.02,
            backgroundColor: new THREE.Color( 0x777777 ),
            fontColor: new THREE.Color( 0x222222 )
        }
    }, []);

    const buttonOptions = useMemo(() => {
        return {
            width: 0.4,
            height: 0.15,
            justifyContent: 'center',
            offset: 0.05,
            margin: 0.02,
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontSize: 0.07,
            // borderRadius: 0.075
        }
    }, []);

    const hoveredStateAttributes = useMemo(() => {
        return {
            state: 'hovered',
            attributes: {
                // offset: 0.035,
                backgroundColor: new THREE.Color( 0x999999 ),
                backgroundOpacity: 1,
                fontColor: new THREE.Color( 0xffffff )
            }
        }
    }, []);

    const idleStateAttributes = useMemo(() => {
        return {
            state: 'idle',
            attributes: {
                // offset: 0.035,
                backgroundColor: new THREE.Color( 0x666666 ),
                backgroundOpacity: 0.3,
                fontColor: new THREE.Color( 0xffffff )
            }
        }
    }, []);

    useEffect(() => {
        // const container = new ThreeMeshUI.Block( {
        //     justifyContent: 'center',
        //     contentDirection: 'row-reverse',
        //     fontFamily: FontJSON,
        //     fontTexture: FontImage,
        //     fontSize: 0.07,
        //     padding: 0.02,
        //     // borderRadius: 0.11
        // } );
    
        // container.position.set( 0, 0.6, -1.2 );
        // container.rotation.x = -0.55;
        buttonRef.current.position.y = position[1];
        buttonRef.current.position.x = position[0];

        const button = new ThreeMeshUI.Block( buttonOptions );
        button.add(
            new ThreeMeshUI.Text( { content: text } )
        );

        // container.add(button);
        buttonRef.current.add( button );

        button.setupState( {
            state: 'selected',
            attributes: selectedAttributes,
            // onSet: () => {
    
            //     currentMesh = ( currentMesh + 1 ) % 3;
            //     showMesh( currentMesh );
    
            // }
        } );
        button.setupState( hoveredStateAttributes );
        button.setupState( idleStateAttributes );

        return button.onAfterUpdate = function () {
            
            if ( selected ) {
                button.setState('selected')
            } 
            else {
                button.setState('hovered');
            }

            if(!hover) {
                button.setState('idle');
            }
        }
    
    }, [text, position, hover, selected, buttonOptions, hoveredStateAttributes, idleStateAttributes, selectedAttributes]);

    useFrame(() => {
        ThreeMeshUI.update();
    });

    useInteraction(buttonRef, 'onSelectStart', () => {
        setSelected(true);
        buttonRef.current.position.z -= 0.035;
        onSelect();
    });
    useInteraction(buttonRef, 'onSelectEnd', () => {
        setSelected(false);
        buttonRef.current.position.z += 0.035;
    });
    useInteraction(buttonRef, "onHover", () => {
        setHover(true);
    });
    useInteraction(buttonRef, "onBlur", () => {
        setHover(false);
    });

    return (
        <block ref={buttonRef}   
        ></block>
    );
};

export default Button;
