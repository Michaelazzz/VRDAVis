import { useRef, useState } from 'react'
import { Interactive, useController, useInteraction } from '@react-three/xr'
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import ThreeMeshUI from 'three-mesh-ui'

extend(ThreeMeshUI)

import Panel from './Panel'
import ChartWrapper from './ChartWrapper'
import Button from './Button'

function Title({ accentColor }:any) {
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
      {/* @ts-ignore */}
      <text content={'Hello '} />
      {/* @ts-ignore */}
      <text content={'world!'} args={[{ fontColor: accentColor }]} />
    </block>
  )
}

function HandMenu ({children, ...rest}: any) {
  const ref = useRef<THREE.Mesh>() // reference for hand mounted menu
  // const ref = useRef()
  const leftController = useController("left")

  const buttonRef = useRef()
  const [accentColor] = useState(() => new THREE.Color('red'))
  
  useFrame((state) => {
    if(!leftController) {
      return
    }

    const controller = leftController.controller
    const x = 0
    const y = 0.3
    const z = -0.3
    const offset = new THREE.Vector3(-controller.position.x+x,-controller.position.y+y,-controller.position.z+z)
    if(ref.current) {
      // const position =  new THREE.Vector3().copy(controller.position)
      ref.current.position.copy(controller.position).add(offset)
      // ref.current.quaternion.copy(controller.quaternion)
      leftController.controller.add(ref.current)
    }

    if(buttonRef)
    {
      useInteraction(buttonRef, 'onSelect', () => accentColor.offsetHSL(1 / 3, 0, 0))
    }
  })

  return (
    <group
      ref={ref} {...rest}
    >
      <Panel>
        <Title accentColor={accentColor} /> 
        {/* @ts-ignore  */}
        <Button ref={buttonRef} onSelect={() => accentColor.offsetHSL(1 / 3, 0, 0)} />
        
        <ChartWrapper />
      </Panel>
    </group>
  )
}

export default HandMenu;