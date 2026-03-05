import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  position: THREE.Vector3
}

export default function Particles({ position }: ParticlesProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const particles = useMemo(() => {
    const items = []
    for (let i = 0; i < 20; i++) {
      items.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          Math.random() * 6,
          (Math.random() - 0.5) * 8
        ),
        scale: 0.05 + Math.random() * 0.1,
        color: Math.random() > 0.5 ? '#00ffcc' : '#ff6644'
      })
    }
    return items
  }, [])

  const startTime = useRef(Date.now())

  useFrame(() => {
    if (!groupRef.current) return

    const elapsed = (Date.now() - startTime.current) / 1000
    const gravity = 9.8

    groupRef.current.children.forEach((child, i) => {
      const particle = particles[i]
      if (!particle) return

      child.position.x = particle.velocity.x * elapsed
      child.position.y = particle.velocity.y * elapsed - 0.5 * gravity * elapsed * elapsed
      child.position.z = particle.velocity.z * elapsed

      const scale = particle.scale * Math.max(0, 1 - elapsed * 2)
      child.scale.setScalar(scale)
    })
  })

  return (
    <group ref={groupRef} position={position.toArray()}>
      {particles.map((particle, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}
