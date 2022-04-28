import {forwardRef, useRef, useState} from "react";
import {Interactive, useController, useInteraction, useXREvent} from "@react-three/xr";
import {extend, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";

extend(ThreeMeshUI);

import Panel from "./Panel";
import Button from "./Button";
import ChartPanel from "./ChartPanel";

const Title = forwardRef(({accentColor, text}: any, ref) => {
    return (
        <block
            args={[
                {
                    width: 1,
                    height: 0.25,
                    backgroundOpacity: 0,
                    justifyContent: "center"
                }
            ]}
        >
            {/* @ts-ignore */}
            <text content={"Hello "} />
            {/* @ts-ignore */}
            <text ref={ref} content={text+"!"} args={[{fontColor: accentColor}]} />
        </block>
    );
});

function HandMenu({children, ...rest}: any) {
    const [data, setData] = useState([12, 19, 3, 5, 2, 3]);

    // setInterval(() => {
    //     setData(Array.from({length: 6}, () => Math.floor(Math.random() * 10)));
    // }, 6000);

    const ref = useRef<THREE.Mesh>(); // reference for hand mounted menu
    // const ref = useRef();
    const leftController = useController("left");

    const raycaster = new THREE.Raycaster();

    // const buttonRef = useRef();
    const [accentColor] = useState(() => new THREE.Color("red"));

    const titleRef = useRef();

    useFrame(state => {
        if (!leftController) {
            return;
        }

        const controller = leftController.controller;
        const x = 0;
        const y = 0.6;
        const z = -0.5;
        const offset = new THREE.Vector3(-controller.position.x + x, -controller.position.y + y, -controller.position.z + z);
        
        if (ref.current) {
            // const position =  new THREE.Vector3().copy(controller.position);
            ref.current.position.copy(controller.position).add(offset);
            // ref.current.quaternion.copy(controller.quaternion);
            leftController.controller.add(ref.current);
        }

        ThreeMeshUI.update();
    });

    const onButtonSelect = () => {
        accentColor.offsetHSL(1 / 3, 0, 0);
        if(titleRef.current) {
            // @ts-ignore
            titleRef.current.set({ content: 'Michaela!'});
        }
            
        
    }

    // useXREvent("squeeze", () => accentColor.offsetHSL(1 / 3, 0, 0));
    // useXREvent("select", () => accentColor.offsetHSL(1 / 3, 0, 0));
    // useInteraction(buttonRef, 'onSelect', () => accentColor.offsetHSL(1 / 3, 0, 0));

    return (
        <group ref={ref} {...rest}>
            <Panel height={1}>
                <Title ref={titleRef} accentColor={accentColor} text={'World'} />
                {/* @ts-ignore  */}
                <Button onSelect={onButtonSelect}/>
                <ChartPanel
                    data={data}
                />
            </Panel>
        </group>
    );
}

HandMenu.displayName = "Hand Menu";

export default HandMenu;
