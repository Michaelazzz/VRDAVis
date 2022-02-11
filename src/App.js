import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { Box } from '@react-three/drei'

function App() {
  return (
    <>
      <VRCanvas>
        {/* lighting */}
        <ambientLight />
        <spotLight position={[5,5,5]}/>

        {/* controls */}
        <DefaultXRControllers />

        <Box position={[0,0,-5]}>
          <meshStandardMaterial color="#e23" />
        </Box>

      </VRCanvas>
    </>
  );
}

export default App;
