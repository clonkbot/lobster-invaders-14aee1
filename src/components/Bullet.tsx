import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BulletProps {
  position: THREE.Vector3
}

export default function Bullet({ position }: BulletProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 10
    }
  })

  return (
    <group position={position.toArray()}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Trail effect */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight intensity={0.8} color="#00ffcc" distance={2} />
    </group>
  )
}
