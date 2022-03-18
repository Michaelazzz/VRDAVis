import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial } from '@react-three/drei'

import Chart from './Chart'
import { MeshStandardMaterial } from 'three'

const ChartWrapper = ({props}:any) => {

  const [data, setData] = useState([5,6,7])

  let ref = useRef()
  let imageRef = useRef()
  let texture = null
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
          <Chart data={data} setRef={ref} {...props} />
        </Html>
    </block>
    
  )
}

export default ChartWrapper