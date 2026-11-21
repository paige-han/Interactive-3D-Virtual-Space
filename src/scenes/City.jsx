// Loading a large Draco-compressed GLB and framing it automatically
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'

const MODEL = './models/city.glb'
const DRACO = './draco/'

function CityModel() {
  const { scene } = useGLTF(MODEL, DRACO)
  return <primitive object={scene} />
}

export default function City() {
  return (
    <>
      <color attach="background" args={['#dfe7ef']} />
      <fog attach="fog" args={['#dfe7ef', 300, 900]} />
      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2.1} />
      <hemisphereLight intensity={0.9} groundColor="#9aa4ae" />
      <directionalLight position={[100, 200, 80]} intensity={1.6} />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <CityModel />
        </Center>
      </Bounds>
    </>
  )
}
