import { useState } from 'react'
import { VRCanvas, DefaultXRControllers, Interactive, Hands } from '@react-three/xr'
import { Box, Text } from '@react-three/drei'

function App() {
  const [logs, setLog] = useState(['Log:'])

  // add to log
  const addLog = (log) => {
    console.log(log)
    setLog(...logs, log)
  }

  return (
    <>
      <VRCanvas>
        {/* lighting */}
        <ambientLight />
        <spotLight position={[5,5,5]}/>

        {/* controls */}
        <DefaultXRControllers />
        {/* <Hands /> */}

        {/* log  */}
        <Text
          position={[-1, 2, -1]}
        >
          {logs}
        </Text>

        <Interactive onSelect={() => addLog('clicked!')}>
          <Box position={[0,0,-5]}>
            <meshStandardMaterial color="#e23" />
          </Box>
        </Interactive>
        

      </VRCanvas>
    </>
  );
}

export default App;
