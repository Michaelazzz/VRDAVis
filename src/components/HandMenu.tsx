import { useRef, useState } from 'react'
import { useController } from '@react-three/xr'
import { useFrame } from "@react-three/fiber"
import ThreeMeshUI from 'three-mesh-ui'
import * as THREE from 'three'

// import Panel from './Panel'
import Button from './Button'

function Title({ accentColor }: any) {

  return (
    <block
      content={'title'}
      args={[
        {
          width: 1,
          height: 0.25,
          backgroundOpacity: 0,
          justifyContent: 'center'
        }
      ]}>
      <text content={'Hello '} />
      <text content={'click'} args={[{ fontColor: accentColor }]} />
    </block>
  )
}

function Panel() {
  const [accentColor] = useState(() => new THREE.Color('red'))
  useFrame(() => {
    ThreeMeshUI.update()
  })
  return (
    <block
      args={[
        {
          width: 1,
          height: 0.5,
          fontSize: 0.1,
          backgroundOpacity: 1,
          // fontFamily: './Roboto-msdf.json',
          // fontTexture: './Roboto-msdf.png'
        }
      ]}>
      <Title accentColor={accentColor} />
      <Button onClick={() => accentColor.offsetHSL(1 / 3, 0, 0)} />
    </block>
  )
}

function HandMenu ({children, ...rest}: any) {
  const ref = useRef<THREE.Mesh>() // reference for hand mounted menu
  const leftController = useController("left")

  useFrame((state) => {
    if(!leftController) {
      return
    }

    const controller = leftController.controller
    const x = 0
    const y = 0.1
    const z = -0.3
    const offset = new THREE.Vector3(-controller.position.x+x,-controller.position.y+y,-controller.position.z+z)
    if(ref.current) {
      // const position =  new THREE.Vector3().copy(controller.position)
      ref.current.position.copy(controller.position).add(offset)
      // ref.current.quaternion.copy(controller.quaternion)
      leftController.controller.add(ref.current)
    }
  })

  // const onTabSelect = (e:any) => {
    // console.log(e.object)
    // ref.current?.children[0].position.setZ(0)
    // console.log(e.object.position.setZ(0.01))
  // }

  return (
    <group
      ref={ref} {...rest}
    >
      <Panel/>


      {/* <Panel
        position={[0,0,0.01]}
        panelPos={0}
        colour={"#f8f6b4"}
      >
        <Button
          text={'button'}
          position={[0,0,0.5]}
          scale={[0.1,0.1,1]}
        />
      </Panel>
      <Panel
        panelPos={1}
        colour={"#daf7dc"}
      ></Panel>
      <Panel
        panelPos={2}
        colour={"#abc8c0"}
      ></Panel>
      <Panel
        panelPos={3}
        colour={"#70566d"}
      ></Panel>
      <Panel
        panelPos={4}
        colour={"#42273b"}
        textColour={"white"}
      ></Panel> */}
    </group>
  )
}

export default HandMenu;