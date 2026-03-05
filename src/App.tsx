import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import Game from './components/Game'
import HUD from './components/HUD'

export default function App() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [wave, setWave] = useState(1)
  const [gameStarted, setGameStarted] = useState(false)

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives(prev => {
      if (prev <= 1) {
        setGameOver(true)
        return 0
      }
      return prev - 1
    })
  }, [])

  const nextWave = useCallback(() => {
    setWave(prev => prev + 1)
  }, [])

  const restartGame = useCallback(() => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setWave(1)
    setGameStarted(true)
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Animated scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 200, 0.03) 2px, rgba(0, 255, 200, 0.03) 4px)'
        }}
      />

      {/* CRT glow effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 200, 255, 0.1), inset 0 0 80px rgba(255, 50, 50, 0.05)'
        }}
      />

      <Canvas
        camera={{ position: [0, 8, 14], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#0a0a2a', 15, 40]} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 10, 0]} intensity={1} color="#00ffcc" />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff3366" />
          <pointLight position={[10, 5, -10]} intensity={0.5} color="#3366ff" />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Game
            gameStarted={gameStarted}
            gameOver={gameOver}
            wave={wave}
            addScore={addScore}
            loseLife={loseLife}
            nextWave={nextWave}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>

      <HUD
        score={score}
        lives={lives}
        wave={wave}
        gameOver={gameOver}
        gameStarted={gameStarted}
        onRestart={restartGame}
        onStart={startGame}
      />

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center z-30">
        <p className="text-[10px] md:text-xs text-cyan-900/60 tracking-widest font-mono">
          Requested by <span className="text-cyan-700/70">@BetrNames</span> · Built by <span className="text-cyan-700/70">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}
