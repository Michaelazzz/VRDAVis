import React, { useState, useRef, useEffect } from 'react'
import { extend, useFrame } from "@react-three/fiber"
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import ThreeMeshUI from 'three-mesh-ui'
import Button from './Button'
import Chart from './Chart'

extend(ThreeMeshUI)

function Title({ accentColor }) {
  return (
    <block
      args={[
        {
          width: 1,
          height: 0.25,
          backgroundOpacity: 0,
          justifyContent: 'center'
        }
      ]}>
      <text content={'Hello '} />
      <text content={'world!'} args={[{ fontColor: accentColor }]} />
    </block>
  )
}

function Panel() {

  const [data, setData] = useState([5,6,7])

  setInterval(() => {
    setData([
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1, 
      Math.floor(Math.random() * 10) + 1
    ])
    // console.log("Panel: ",data)
  }, 2000)

  // const ref = useRef()

  // const [accentColor] = useState(() => new THREE.Color('red'))
  useFrame(() => {
    ThreeMeshUI.update()
  })
  return (
    <block
      // ref={ref}
      args={[
        {
          width: 1,
          height: 0.5,
          fontSize: 0.1,
          backgroundOpacity: 0.1,
          fontFamily: './Roboto-msdf.json',
          fontTexture: './Roboto-msdf.png'
        }
      ]}>
      {/* <Title accentColor={accentColor} /> */}
      {/* <Button onClick={() => accentColor.offsetHSL(1 / 3, 0, 0)} /> */}

      <Html
        prepend
        center
        // distanceFactor={5}
        // portal={ref}
        // transform
        // sprite
      >
        <Chart data={data} />
      </Html>
      
    </block>
  )
}

export default Panel