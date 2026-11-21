// Loading an animated GLB character and switching its animation clips
import { useEffect } from 'react'
import { ContactShadows, OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

const MODEL = './models/robot.glb'

export default function Character() {
  const { scene, animations } = useGLTF(MODEL)
  const { actions, names } = useAnimations(animations, scene)

  const { animation } = useControls('Character', {
    animation: { options: names, value: names.includes('Idle') ? 'Idle' : names[0] },
  })

  useEffect(() => {
    const action = actions[animation]
    action?.reset().fadeIn(0.4).play()
    return () => action?.fadeOut(0.4)
  }, [animation, actions])

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) o.castShadow = true
    })
  }, [scene])

  return (
    <>
      <color attach="background" args={['#eef1f4']} />
      <OrbitControls makeDefault enableDamping target={[0, 0.9, 0]} />
      <hemisphereLight intensity={0.6} groundColor="#b9c2cc" />
      <directionalLight position={[2, 4, 3]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
      <primitive object={scene} />
      <ContactShadows position={[0, 0, 0]} scale={6} blur={2.4} opacity={0.45} far={3} />
    </>
  )
}

useGLTF.preload(MODEL)
