import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Lobster from './Lobster'
import Alien from './Alien'
import Bullet from './Bullet'
import AlienBullet from './AlienBullet'
import Particles from './Particles'

interface GameProps {
  gameStarted: boolean
  gameOver: boolean
  wave: number
  addScore: (points: number) => void
  loseLife: () => void
  nextWave: () => void
}

interface BulletData {
  id: number
  position: THREE.Vector3
}

interface AlienData {
  id: number
  position: THREE.Vector3
  alive: boolean
  type: number
}

export default function Game({
  gameStarted,
  gameOver,
  wave,
  addScore,
  loseLife,
  nextWave
}: GameProps) {
  const [lobsterPosition, setLobsterPosition] = useState(new THREE.Vector3(0, 0, 8))
  const [bullets, setBullets] = useState<BulletData[]>([])
  const [alienBullets, setAlienBullets] = useState<BulletData[]>([])
  const [aliens, setAliens] = useState<AlienData[]>([])
  const [explosions, setExplosions] = useState<THREE.Vector3[]>([])

  const bulletIdRef = useRef(0)
  const alienBulletIdRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const lastShotRef = useRef(0)
  const alienDirectionRef = useRef(1)
  const alienDropRef = useRef(false)

  // Initialize aliens for current wave
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const newAliens: AlienData[] = []
    const rows = Math.min(3 + Math.floor(wave / 2), 5)
    const cols = Math.min(6 + wave, 10)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newAliens.push({
          id: row * cols + col,
          position: new THREE.Vector3(
            (col - cols / 2 + 0.5) * 1.5,
            0,
            -8 + row * 1.5
          ),
          alive: true,
          type: row % 3
        })
      }
    }
    setAliens(newAliens)
    alienDirectionRef.current = 1
    setLobsterPosition(new THREE.Vector3(0, 0, 8))
  }, [wave, gameStarted, gameOver])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch controls
  useEffect(() => {
    let touchStartX = 0
    let isTouching = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      isTouching = true

      // Shoot on tap
      const now = Date.now()
      if (now - lastShotRef.current > 200 && gameStarted && !gameOver) {
        lastShotRef.current = now
        setBullets(prev => [...prev, {
          id: bulletIdRef.current++,
          position: lobsterPosition.clone().add(new THREE.Vector3(0, 0.5, -0.5))
        }])
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return
      const diff = e.touches[0].clientX - touchStartX
      const sensitivity = 0.02
      setLobsterPosition(prev => {
        const newX = Math.max(-8, Math.min(8, prev.x + diff * sensitivity))
        return new THREE.Vector3(newX, prev.y, prev.z)
      })
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      isTouching = false
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [lobsterPosition, gameStarted, gameOver])

  // Game loop
  useFrame((state, delta) => {
    if (!gameStarted || gameOver) return

    // Move lobster
    const speed = 8 * delta
    if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) {
      setLobsterPosition(prev => new THREE.Vector3(
        Math.max(-8, prev.x - speed),
        prev.y,
        prev.z
      ))
    }
    if (keysRef.current.has('d') || keysRef.current.has('arrowright')) {
      setLobsterPosition(prev => new THREE.Vector3(
        Math.min(8, prev.x + speed),
        prev.y,
        prev.z
      ))
    }

    // Shoot
    if (keysRef.current.has(' ') || keysRef.current.has('w') || keysRef.current.has('arrowup')) {
      const now = Date.now()
      if (now - lastShotRef.current > 200) {
        lastShotRef.current = now
        setBullets(prev => [...prev, {
          id: bulletIdRef.current++,
          position: lobsterPosition.clone().add(new THREE.Vector3(0, 0.5, -0.5))
        }])
      }
    }

    // Move bullets
    setBullets(prev => prev
      .map(b => ({
        ...b,
        position: new THREE.Vector3(b.position.x, b.position.y, b.position.z - 20 * delta)
      }))
      .filter(b => b.position.z > -15)
    )

    // Move alien bullets
    setAlienBullets(prev => prev
      .map(b => ({
        ...b,
        position: new THREE.Vector3(b.position.x, b.position.y, b.position.z + 15 * delta)
      }))
      .filter(b => b.position.z < 12)
    )

    // Move aliens
    const aliveAliens = aliens.filter(a => a.alive)
    if (aliveAliens.length === 0) {
      nextWave()
      return
    }

    const alienSpeed = (0.8 + wave * 0.2) * delta
    let shouldDrop = false

    const newAliens = aliens.map(alien => {
      if (!alien.alive) return alien

      const newX = alien.position.x + alienDirectionRef.current * alienSpeed

      if (Math.abs(newX) > 7) {
        shouldDrop = true
      }

      return {
        ...alien,
        position: new THREE.Vector3(newX, alien.position.y, alien.position.z)
      }
    })

    if (shouldDrop && !alienDropRef.current) {
      alienDropRef.current = true
      setAliens(prev => prev.map(alien => ({
        ...alien,
        position: new THREE.Vector3(
          alien.position.x,
          alien.position.y,
          alien.position.z + 0.5
        )
      })))
      alienDirectionRef.current *= -1

      setTimeout(() => {
        alienDropRef.current = false
      }, 100)
    } else if (!shouldDrop) {
      setAliens(newAliens)
    }

    // Alien shooting
    if (Math.random() < 0.01 * (1 + wave * 0.1)) {
      const shooters = aliveAliens.filter(() => Math.random() < 0.1)
      if (shooters.length > 0) {
        const shooter = shooters[Math.floor(Math.random() * shooters.length)]
        setAlienBullets(prev => [...prev, {
          id: alienBulletIdRef.current++,
          position: shooter.position.clone().add(new THREE.Vector3(0, -0.3, 0.5))
        }])
      }
    }

    // Collision detection - bullets vs aliens
    setBullets(prevBullets => {
      const remainingBullets: BulletData[] = []

      for (const bullet of prevBullets) {
        let bulletHit = false

        setAliens(prevAliens => {
          return prevAliens.map(alien => {
            if (!alien.alive || bulletHit) return alien

            const dist = bullet.position.distanceTo(alien.position)
            if (dist < 0.8) {
              bulletHit = true
              addScore((3 - alien.type) * 10 + 10)
              setExplosions(prev => [...prev, alien.position.clone()])
              setTimeout(() => {
                setExplosions(prev => prev.slice(1))
              }, 500)
              return { ...alien, alive: false }
            }
            return alien
          })
        })

        if (!bulletHit) {
          remainingBullets.push(bullet)
        }
      }

      return remainingBullets
    })

    // Collision detection - alien bullets vs lobster
    setAlienBullets(prevBullets => {
      return prevBullets.filter(bullet => {
        const dist = bullet.position.distanceTo(lobsterPosition)
        if (dist < 1) {
          loseLife()
          setExplosions(prev => [...prev, lobsterPosition.clone()])
          setTimeout(() => {
            setExplosions(prev => prev.slice(1))
          }, 500)
          return false
        }
        return true
      })
    })

    // Check if aliens reached bottom
    for (const alien of aliveAliens) {
      if (alien.position.z > 6) {
        loseLife()
        break
      }
    }
  })

  return (
    <group>
      {/* Ground grid */}
      <gridHelper args={[30, 30, '#00ffcc', '#0a2020']} position={[0, -0.5, 0]} />

      {/* Player lobster */}
      <Lobster position={lobsterPosition} />

      {/* Bullets */}
      {bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}

      {/* Alien bullets */}
      {alienBullets.map(bullet => (
        <AlienBullet key={bullet.id} position={bullet.position} />
      ))}

      {/* Aliens */}
      {aliens.filter(a => a.alive).map(alien => (
        <Alien key={alien.id} position={alien.position} type={alien.type} />
      ))}

      {/* Explosions */}
      {explosions.map((pos, i) => (
        <Particles key={i} position={pos} />
      ))}

      {/* Decorative ocean floor elements */}
      <OceanFloor />
    </group>
  )
}

function OceanFloor() {
  const rocks = useMemo(() => {
    const items = []
    for (let i = 0; i < 20; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 25,
          -0.4,
          (Math.random() - 0.5) * 25
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.3
      })
    }
    return items
  }, [])

  return (
    <>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.position}>
          <dodecahedronGeometry args={[rock.scale, 0]} />
          <meshStandardMaterial color="#1a3040" roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}
