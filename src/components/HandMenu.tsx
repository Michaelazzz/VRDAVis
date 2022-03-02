import { useRef } from 'react'
import { useController } from '@react-three/xr'
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import ThreeMeshUI from 'three-mesh-ui'

extend(ThreeMeshUI)

import Panel from './Panel'

function HandMenu ({children, ...rest}: any) {
  const ref = useRef<THREE.Mesh>() // reference for hand mounted menu
// const ref = useRef()
  const leftController = useController("left")

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
  })

  return (
    <group
      ref={ref} {...rest}
    >
        <Panel />
        {/* <Box>
          <MeshBasicMaterial color="#191716" />
        </Box> */}
    </group>
  )
}

export default HandMenu;