import { useThree } from '@react-three/fiber'
import React, { useEffect, useRef, Component, createRef } from 'react'
import { Html } from '@react-three/drei'
// import Canvas from './Canvas'
import ChartWrapper from './ChartWrapper'

const CanvasToTexture = () => {

    // take in chart component
    
    // convert to canvas texture using 

    // set block element's texture to the canvas texture
    // return three-mesh-ui block element with texture

    let ref = useRef()

    // setInterval(() => {
    //     console.log(ref.current)
    // }, 2000)

    useEffect(() => {
        console.log(ref.current)
    }, [ref])
    
    return (
        <block
            args={[
                {
                    width: 1,
                    height: 0.5,
                    fontSize: 0.1,
                    backgroundOpacity: 0.1,
                    fontFamily: './Roboto-msdf.json',
                    fontTexture: './Roboto-msdf.png',
                    // backgroundTexture: dataURL
                }
            ]}
        >
            {/* {children} */}
            <Html>
                <ChartWrapper ref={ref} />
            </Html>
        </block>
    )
    
}

export default CanvasToTexture