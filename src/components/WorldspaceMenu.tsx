import React, { useRef } from 'react'
import Panel from './Panel'
import PanelText from './PanelText';

const WorldspaceMenu = ({position = [0,0,0]}: any) => {

    const ref = useRef<THREE.Mesh>(); // reference for hand mounted menu

    return (
        <group ref={ref} position={position}>
            <Panel 
                height={1}
            >
                <PanelText>
                    Worldspace Menu
                </PanelText>
                
            </Panel>
        </group>
    )
}

export default WorldspaceMenu