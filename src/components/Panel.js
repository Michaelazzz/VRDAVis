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

export const data = {
  datasets: [
    {
      label: 'A dataset',
      data: [{
        x: -10,
        y: 0
      }, {
        x: 0,
        y: 10
      }, {
        x: 10,
        y: 5
      }, {
        x: 0.5,
        y: 5.5
      }],
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
};

function Panel() {

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
        distanceFactor={6}
        // portal={ref}
        // transform
        // sprite
      >
        <Chart data={data}/>
      </Html>
      
    </block>
  )
}

export default Panel