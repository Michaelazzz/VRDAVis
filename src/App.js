import { useRef, useState } from 'react'
import { 
  VRCanvas, 
  DefaultXRControllers, 
  Interactive, 
  RayGrab,
  useController,
  useXRFrame,
  // useXR
} from '@react-three/xr'
import { Box, Text } from '@react-three/drei'

function App() {

  // const { controllers } = useXR()

  // XR events
  // useXREvent('select', (e) => addLog('select event has been triggered'))
  // useXREvent('selectstart', (e) => addLog('select event has started'))
  // useXREvent('selectend', (e) => addLog('select event has ended'))
  // useXREvent('squeeze', (e) => addLog('squeeze event has been triggered'))
  // useXREvent('squeezestart', (e) => addLog('squeeze event has started'))
  // useXREvent('squeezeeend', (e) => addLog('squeeze event has ended'))

  const [logs, setLog] = useState(['Log:'])

  // add to log
  const addLog = (log) => {
    console.log(log)
    setLog([...logs, log])
  }

  const HandMenu = () => {
    const ref = useRef() // reference for hand mounted menu
    const leftController = useController('left')

    useXRFrame(() => {
      if(leftController.controller === undefined) return;
  
      setLog(leftController.grip)
  
      setLog(ref)
    })

    return (
      <Box 
      ref={ref}
        scale={[0.2,0.2,0.2]}
      >
        <meshStandardMaterial color="#FDC5F5" />
      </Box>
    )
  }


  

 

  
  

  return (
    <VRCanvas>
      {/* lighting */}
      <ambientLight />
      <spotLight position={[2,2,2]}/>

      {/* controls */}
      <DefaultXRControllers />
      {/* <Hands /> */}

      {/* log  */}
      <Text
        position={[-1, 2, -1]}
      >
        {logs}
      </Text>

      <Interactive 
        onSelect={() => addLog('click')} 
        onHover={() => addLog('hover')} 
        onBlur={() => addLog('blur')}
      >
        <Box position={[-1,0,-1]}>
          <meshStandardMaterial color="#e23" />
        </Box>
      </Interactive>

      <RayGrab>
        <Box position={[1,0,-1]}>
          <meshStandardMaterial color="#E23" />
        </Box>
      </RayGrab>
      
     

      <HandMenu />

    </VRCanvas>
  );
}

export default App;
