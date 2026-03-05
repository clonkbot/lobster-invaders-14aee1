import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AlienBulletProps {
  position: THREE.Vector3
}

export default function AlienBullet({ position }: AlienBulletProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 8
      ref.current.rotation.x = state.clock.elapsedTime * 6
    }
  })

  return (
    <group position={position.toArray()}>
      <mesh ref={ref}>
        <tetrahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#ff3366"
          emissive="#ff3366"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Trail effect */}
      <mesh position={[0, 0, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 6]} />
        <meshStandardMaterial
          color="#ff3366"
          emissive="#ff3366"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight intensity={0.6} color="#ff3366" distance={2} />
    </group>
  )
}
