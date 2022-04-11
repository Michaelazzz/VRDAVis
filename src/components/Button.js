import {useInteraction, useXREvent} from "@react-three/xr";
import React, {useRef, useEffect, useState, useCallback} from "react";
import * as THREE from "three";

const Button = ({onSelect}) => {

    const button = useRef()

    useEffect(() => {
        if (button.current) {
            button.current.setupState({
                state: "hovered",
                attributes: {
                    offset: 0.05,
                    backgroundColor: new THREE.Color(0x999999),
                    backgroundOpacity: 1,
                    fontColor: new THREE.Color(0xffffff)
                }
            });
            button.current.setupState({
                state: "idle",
                attributes: {
                    offset: 0.035,
                    backgroundColor: new THREE.Color(0x666666),
                    backgroundOpacity: 0.3,
                    fontColor: new THREE.Color(0xffffff)
                }
            });
            button.current.setupState({
                state: "selected",
                attributes: {
                    offset: 0.02,
                    backgroundColor: new THREE.Color(0x777777),
                    fontColor: new THREE.Color(0x222222)
                }
            });
            button.current.setState("idle");
        }
    });

    useInteraction(button, 'onSelectStart', () => {button.current.setState("selected"); onSelect();});
    useInteraction(button, 'onSelectEnd', () => button.current.setState("hovered"));
    useInteraction(button, 'onSqueezeStart', () => {button.current.setState("selected"); onSelect();});
    useInteraction(button, 'onSqueezeEnd', () => button.current.setState("hovered"));
    useInteraction(button, "onHover", () => button.current.setState("hovered"));
    useInteraction(button, "onBlur", () => button.current.setState("idle"));

    return (
        <block
            ref={button}
            args={[
                {
                    width: 0.5,
                    height: 0.2,
                    justifyContent: "center",
                    borderRadius: 0.075
                }
            ]}
        >
            <text content={"Click"} />
        </block>
    );
};

export default Button;
