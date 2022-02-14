import { useState } from 'react'
import { VRCanvas, DefaultXRControllers, Interactive, RayGrab } from '@react-three/xr'
import { Box, Text } from '@react-three/drei'

function App() {
  const [logs, setLog] = useState(['Log:'])

  // add to log
  const addLog = (log) => {
    console.log(log)
    setLog(...logs, log)
  }

  // const { controllers } = useXR()

  // XR events
  // useXREvent('select', (e) => addLog('select event has been triggered'))
  // useXREvent('selectstart', (e) => addLog('select event has started'))
  // useXREvent('selectend', (e) => addLog('select event has ended'))
  // useXREvent('squeeze', (e) => addLog('squeeze event has been triggered'))
  // useXREvent('squeezestart', (e) => addLog('squeeze event has started'))
  // useXREvent('squeezeeend', (e) => addLog('squeeze event has ended'))

  // useXRFrame((time, xrFrame) => {
    // do something on each frame of an active XR session

    // attach menu to left controller
  // })

  return (
    <>
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
            <meshStandardMaterial color="#e23" />
          </Box>
        </RayGrab>
        
        

      </VRCanvas>
    </>
  );
}

export default App;
