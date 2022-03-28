import React, { useEffect, useRef, useState } from 'react'

import * as THREE from 'three'
// import { useThree, useFrame, render } from '@react-three/fiber'
import { Html } from '@react-three/drei'

import Chart from './Chart'
import Portal from './Portal'

const ChartWrapper = ({parentRef, props}:any) => {

  const [data, setData] = useState([5,6,7])

  let ref = useRef()
  let imageRef = useRef()
  let canvas = null
  const loader = new THREE.TextureLoader();

  setInterval(() => {
    setData([
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1, 
      Math.floor(Math.random() * 10) + 1
    ])
  }, 2000)

  useEffect(() => {

    if(ref.current)
    {
      // @ts-ignore 
      canvas = ref.current.canvas
      let dataURL = canvas.toDataURL()

      // texture = new THREE.CanvasTexture(canvas)
      // texture.needsUpdate = true;

      if(imageRef.current)
      {
        loader.load(dataURL, (texture) => {
          // @ts-ignore 
          imageRef.current.set({ backgroundTexture: texture });
        });
      }
    }
    
  })  

  return (
    <block
      ref={imageRef}
      args={[
        {
          width: 1,
          height: 1,
          fontSize: 0.1,
          backgroundOpacity: 1,
          fontFamily: './Roboto-msdf.json',
          fontTexture: './Roboto-msdf.png',
        }
      ]}>
        <Html>
          <Portal>
            <Chart data={data} setRef={ref} {...props} />
          </Portal>
        </Html>
        
    </block>
    
  )
}

export default ChartWrapper