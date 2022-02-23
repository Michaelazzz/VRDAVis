import { useState } from 'react'
import { 
    Box, 
    Text,  
} from '@react-three/drei'
import { Interactive } from '@react-three/xr'
// import { Vector3 } from '@react-three/fiber'

function Button ({ text = 'button', position = [0,0,0], scale = [1,1,1], onClick = () => {} }: any) {

    // const ref = useRef()
    // useInteraction(ref, 'onSelect', () => console.log('selected'))

    const [hover, setHover] = useState(false)
    const [colour, setColour] = useState('#F0EC57')

    const onSelect = () => {
        setColour('#136F63')
        onClick()
    }

    return (
        <Interactive
            onSelect={onSelect}
            onHover={() => setHover(true)}
            onBlur={() => setHover(false)}
        >
            <group
                // ref={ref}
                position={position}
                scale={scale}
            >
                <Text
                    position={[0,0,0.7]}
                    scale={hover ? [2.5,3.5,2.5] : [2,3,2]}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
                <Box
                    scale={[1,0.5,1]}
                >
                    <meshStandardMaterial color={colour} />
                </Box>
            </group>
        </Interactive>
        
    )
}

export default Button