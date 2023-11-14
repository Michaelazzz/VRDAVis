import React, { useEffect, useMemo, useRef, useState } from "react";
import { useController, useInteraction } from "@react-three/xr";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import FontJSON from '../../assets/Roboto-msdf.json';
import FontImage from '../../assets/Roboto-msdf.png';

extend(ThreeMeshUI)

const Button = ({
    position=[0,0], 
    backgroundColor = 0xffffff, 
    width = 0.4, 
    height = 0.1, 
    text='Click', 
    onSelect = () => console.log({text}),
    toggleOn = false
}) => {

    const buttonRef = useRef();
    const [hover, setHover] = useState(false);
    const [selected, setSelected] = useState(false);
    const [toggle, setToggle] = useState(false);

    const selectedAttributes = useMemo(() => {
        return {
            offset: 0.035,
            backgroundColor: new THREE.Color( backgroundColor ),
            fontColor: new THREE.Color( 0x333333 )
        }
    }, [backgroundColor]);

    const buttonOptions = useMemo(() => {
        return {
            width: width,
            height: height,
            justifyContent: 'center',
            offset: 0.05,
            margin: 0.025,
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontSize: 0.04,
            // borderRadius: 0.075
        }
    }, [height, width]);

    const hoveredStateAttributes = useMemo(() => {
        return {
            state: 'hovered',
            attributes: {
                offset: 0.035,
                backgroundColor: new THREE.Color( 0xffffff ),
                backgroundOpacity: 1,
                fontColor: new THREE.Color( 0x333333 )
            }
        }
    }, []);

    const idleStateAttributes = useMemo(() => {
        return {
            state: 'idle',
            attributes: {
                offset: 0.035,
                backgroundColor: new THREE.Color( backgroundColor ),
                backgroundOpacity: 0.3,
                fontColor: new THREE.Color( 0x333333 )
            }
        }
    }, [backgroundColor]);

    const toggleStateAttributes = useMemo(() => {
        return {
            state: 'toggle',
            attributes: {
                // offset: 0.035,
                backgroundColor: new THREE.Color( 0xEE2E31 ),
                backgroundOpacity: 0.8,
                fontColor: new THREE.Color( 0x333333 )
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
        button.setupState( toggleStateAttributes );

        return button.onAfterUpdate = function () {
            if ( selected ) {
                button.setState('selected')
            } else {
                button.setState('hovered');
            }

            if ( toggleOn && toggle ) {
                button.setState('toggle');
            } else {
                button.setState('hovered');
            }

            if(!hover) {
                button.setState('idle');
            }
        }
    
    }, [
        text, 
        position, 
        hover, 
        selected, 
        toggle,
        toggleOn,
        buttonOptions, 
        hoveredStateAttributes, 
        idleStateAttributes, 
        selectedAttributes,
        toggleStateAttributes
    ]);

    useFrame(() => {
        ThreeMeshUI.update();
    });

    useInteraction(buttonRef, 'onSelectStart', () => {
        setSelected(true);
        setToggle(!toggle);
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
