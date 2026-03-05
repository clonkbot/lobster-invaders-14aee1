import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshWobbleMaterial } from '@react-three/drei'

interface AlienProps {
  position: THREE.Vector3
  type: number
}

const ALIEN_COLORS = [
  { main: '#00ffcc', emissive: '#00aa88' },
  { main: '#ff00ff', emissive: '#aa00aa' },
  { main: '#ffff00', emissive: '#aaaa00' }
]

export default function Alien({ position, type }: AlienProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const colors = ALIEN_COLORS[type]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3 + position.x * 0.5) * 0.1
    }
  })

  if (type === 0) {
    // Squid-like alien
    return (
      <group ref={groupRef} position={position.toArray()}>
        <mesh>
          <dodecahedronGeometry args={[0.4, 0]} />
          <MeshWobbleMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.3}
            factor={0.3}
            speed={2}
          />
        </mesh>
        {/* Tentacles */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.3,
              -0.3,
              Math.sin((i * Math.PI) / 2) * 0.3
            ]}
            rotation={[0.5, 0, (i * Math.PI) / 2]}
          >
            <cylinderGeometry args={[0.05, 0.02, 0.4, 6]} />
            <meshStandardMaterial
              color={colors.main}
              emissive={colors.emissive}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
        {/* Eyes */}
        <mesh position={[0.15, 0.1, 0.3]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-0.15, 0.1, 0.3]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight intensity={0.3} color={colors.main} distance={2} />
      </group>
    )
  }

  if (type === 1) {
    // Crab-like alien
    return (
      <group ref={groupRef} position={position.toArray()}>
        <mesh>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <MeshWobbleMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.3}
            factor={0.2}
            speed={3}
          />
        </mesh>
        {/* Pincers */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <meshStandardMaterial color={colors.main} emissive={colors.emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <meshStandardMaterial color={colors.main} emissive={colors.emissive} emissiveIntensity={0.2} />
        </mesh>
        {/* Eyes on stalks */}
        <mesh position={[0.15, 0.25, 0.1]}>
          <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
          <meshStandardMaterial color={colors.main} />
        </mesh>
        <mesh position={[0.15, 0.4, 0.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.15, 0.25, 0.1]}>
          <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
          <meshStandardMaterial color={colors.main} />
        </mesh>
        <mesh position={[-0.15, 0.4, 0.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={0.3} color={colors.main} distance={2} />
      </group>
    )
  }

  // Jellyfish-like alien
  return (
    <group ref={groupRef} position={position.toArray()}>
      <mesh>
        <sphereGeometry args={[0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <MeshWobbleMaterial
          color={colors.main}
          emissive={colors.emissive}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
          factor={0.4}
          speed={2}
        />
      </mesh>
      {/* Tendrils */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 3) * 0.2,
            -0.3,
            Math.sin((i * Math.PI) / 3) * 0.2
          ]}
        >
          <cylinderGeometry args={[0.02, 0.01, 0.5, 4]} />
          <meshStandardMaterial
            color={colors.main}
            emissive={colors.emissive}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      {/* Core */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight intensity={0.5} color={colors.main} distance={2} />
    </group>
  )
}
