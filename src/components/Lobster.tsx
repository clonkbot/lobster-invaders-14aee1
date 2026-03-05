import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

interface LobsterProps {
  position: THREE.Vector3
}

export default function Lobster({ position }: LobsterProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const clawLeftRef = useRef<THREE.Group>(null!)
  const clawRightRef = useRef<THREE.Group>(null!)
  const tailRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Animate claws
    if (clawLeftRef.current) {
      clawLeftRef.current.rotation.z = Math.sin(t * 3) * 0.15 - 0.3
    }
    if (clawRightRef.current) {
      clawRightRef.current.rotation.z = -Math.sin(t * 3) * 0.15 + 0.3
    }

    // Animate tail
    if (tailRef.current) {
      tailRef.current.rotation.x = Math.sin(t * 4) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position.toArray()} rotation={[0, Math.PI, 0]}>
        {/* Main body */}
        <mesh position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.35, 1, 8, 16]} />
          <meshStandardMaterial
            color="#cc2200"
            roughness={0.3}
            metalness={0.2}
            emissive="#ff3300"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Carapace segments */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.3, -0.2 + i * 0.25]}>
            <ringGeometry args={[0.3, 0.38, 16]} />
            <meshStandardMaterial
              color="#991100"
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Head */}
        <mesh position={[0, 0.35, 0.65]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#dd3311"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        {/* Eyes */}
        <group position={[0.15, 0.55, 0.7]}>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
        <group position={[-0.15, 0.55, 0.7]}>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* Antennae */}
        <mesh position={[0.1, 0.5, 0.9]} rotation={[0.5, 0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#ff4422" />
        </mesh>
        <mesh position={[-0.1, 0.5, 0.9]} rotation={[0.5, -0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#ff4422" />
        </mesh>

        {/* Left Claw */}
        <group ref={clawLeftRef} position={[0.5, 0.2, 0.3]}>
          {/* Arm */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
            <meshStandardMaterial color="#cc2200" roughness={0.4} />
          </mesh>
          {/* Claw */}
          <group position={[0.5, 0, 0]}>
            <mesh position={[0.1, 0.05, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.15]} />
              <meshStandardMaterial color="#dd3311" />
            </mesh>
            <mesh position={[0.1, -0.05, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.15]} />
              <meshStandardMaterial color="#dd3311" />
            </mesh>
          </group>
        </group>

        {/* Right Claw */}
        <group ref={clawRightRef} position={[-0.5, 0.2, 0.3]}>
          {/* Arm */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
            <meshStandardMaterial color="#cc2200" roughness={0.4} />
          </mesh>
          {/* Claw */}
          <group position={[-0.5, 0, 0]}>
            <mesh position={[-0.1, 0.05, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.15]} />
              <meshStandardMaterial color="#dd3311" />
            </mesh>
            <mesh position={[-0.1, -0.05, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.15]} />
              <meshStandardMaterial color="#dd3311" />
            </mesh>
          </group>
        </group>

        {/* Legs */}
        {[1, 2, 3].map((i) => (
          <group key={`legs-${i}`}>
            <mesh position={[0.3, 0, -0.1 * i]} rotation={[0, 0, -0.8]}>
              <cylinderGeometry args={[0.03, 0.02, 0.4, 6]} />
              <meshStandardMaterial color="#aa2200" />
            </mesh>
            <mesh position={[-0.3, 0, -0.1 * i]} rotation={[0, 0, 0.8]}>
              <cylinderGeometry args={[0.03, 0.02, 0.4, 6]} />
              <meshStandardMaterial color="#aa2200" />
            </mesh>
          </group>
        ))}

        {/* Tail */}
        <group ref={tailRef} position={[0, 0.15, -0.7]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, 0, -0.12 * i]}>
              <cylinderGeometry args={[0.25 - i * 0.04, 0.25 - (i + 1) * 0.04, 0.15, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#cc2200' : '#aa1800'} />
            </mesh>
          ))}
          {/* Tail fan */}
          <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.2, 6]} />
            <meshStandardMaterial color="#dd3311" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Glow effect underneath */}
        <pointLight position={[0, -0.2, 0]} intensity={0.5} color="#ff6644" distance={3} />
      </group>
    </Float>
  )
}
