import { 
  useRef, 
  // useState
} from 'react'
import { 
  useController,
} from '@react-three/xr'
import { useFrame } from "@react-three/fiber"
import { 
  Box, 
  // Text,  
} from '@react-three/drei'
import * as THREE from 'three'

import Button from './Button'

function HandMenu () {
  const ref = useRef<THREE.Mesh>() // reference for hand mounted menu
  const leftController = useController("right")

  // const [logs, setLog] = useState(['Hand Menu Log:'])

  // add to log
  // const addLog = (log: any) => {
  //   console.log(log)
  //   logs.slice(1).slice(-5)
  //   setLog([...logs, log])
  // }

  useFrame((state) => {
    if(!leftController) {
      return
    }

    const { grip: controller } = leftController
    // addLog(controller)
    const x = 0
    const y = 0.1
    const z = -0.3
    const offset = new THREE.Vector3(-controller.position.x+x,-controller.position.y+y,-controller.position.z+z)
    if(ref.current) {
      // const position =  new THREE.Vector3().copy(controller.position)
      ref.current.position.copy(controller.position).add(offset)
      // ref.current.quaternion.copy(controller.quaternion)
      leftController.grip.add(ref.current)
    }
  })

  // const onButtonSelect = () => {
  //   addLog('button selected')
  // }

  return (
    <group
      ref={ref} 
    >
      {/* hand menu log  */}
      {/* <group
        position={[1, 2, -1]}
      >
        {logs.map((log, index) => (
          <Text
            key={index}
            position={[1, 0.1*(index+1), 0]}
            color="#191716"
          >
            {log}
          </Text>
        ))}
        
      </group> */}
      <Box
        position={[0, 0, 0]}
        scale={[0.5,0.2,0.03]}
      >
        <meshStandardMaterial color="#191716" />
      </Box>
      <Button
        text={'button'}
        position={[0,0,0.01]}
        scale={[0.1,0.1,0.03]}
      />
    </group>
  )
}

export default HandMenu;