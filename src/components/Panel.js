import React, { useState } from 'react'
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import ThreeMeshUI from 'three-mesh-ui'

extend(ThreeMeshUI)

function Panel({ children }) {

  // let ref = useRef()

  const [accentColor] = useState(() => new THREE.Color('red'))
  useFrame(() => {
    ThreeMeshUI.update()
  })

  return (
    <block
      args={[
        {
          width: 1,
          height: 1.5,
          fontSize: 0.1,
          backgroundOpacity: 0.1,
          fontFamily: './Roboto-msdf.json',
          fontTexture: './Roboto-msdf.png'
        }
      ]}>
      
      {/* <CanvasToTexture/> */}

      {/* <Canvas /> */}

      
      {/* <ChartWrapper /> */}
      
      {children}
      
      
    </block>
  )
}

export default Panel