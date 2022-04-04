import React, { useState } from 'react'
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import ThreeMeshUI from 'three-mesh-ui'

extend(ThreeMeshUI)

function Panel({ height = 1, children }) {

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
          height: height,
          fontSize: 0.1,
          backgroundOpacity: 0.1,
          fontFamily: './Roboto-msdf.json',
          fontTexture: './Roboto-msdf.png'
        }
      ]}
    >
      {children}
    </block>
  )
}

export default Panel