// import { useState } from 'react'
import { Interactive } from '@react-three/xr'
import { 
    Box,
    Text
} from '@react-three/drei'

function Panel ({colour, textColour="black", name="name", panelPos = 0, position, active = false, children, ...rest}:any)  {
    const x = -0.2+(panelPos*0.1)
    
    return (
        <group
            position={position}
        >
            <Interactive
                onSelect={() => {console.log('Panel: '+panelPos)}}
            >
                <Box
                    position={[x,0.12,0]}
                    scale={[0.1,0.05,0.03]}
                >
                    <meshStandardMaterial color={colour} />
                    <Text
                        position={[0,0,0.6]}
                        scale={[2,4,1]}
                        color={textColour}
                    >
                        {name}
                    </Text>
                </Box>
            </Interactive>
            <Box
                scale={[0.5,0.2,0.03]}
                {...rest}
            >
                <meshStandardMaterial color={colour} />
                {children}
            </Box>
        </group>
        
    )
}

export default Panel