interface HUDProps {
  score: number
  lives: number
  wave: number
  gameOver: boolean
  gameStarted: boolean
  onRestart: () => void
  onStart: () => void
}

export default function HUD({
  score,
  lives,
  wave,
  gameOver,
  gameStarted,
  onRestart,
  onStart
}: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 md:p-6">
        <div className="flex justify-between items-start gap-2">
          {/* Score */}
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-cyan-500/60 font-mono uppercase">
              Score
            </span>
            <span
              className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 tabular-nums"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          {/* Wave indicator */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-fuchsia-500/60 font-mono uppercase">
              Wave
            </span>
            <div
              className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-400"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {wave}
            </div>
          </div>

          {/* Lives */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-red-500/60 font-mono uppercase">
              Lives
            </span>
            <div className="flex gap-1 md:gap-2 mt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 md:w-8 md:h-8 rounded-full transition-all duration-300 ${
                    i < lives
                      ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
                      : 'bg-gray-800/50 border border-gray-700'
                  }`}
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      {gameStarted && !gameOver && (
        <div className="absolute bottom-12 md:bottom-16 left-0 right-0 flex justify-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2 border border-cyan-900/30">
            <p className="text-[10px] md:text-xs text-cyan-600/80 font-mono tracking-wide text-center">
              <span className="hidden md:inline">
                <span className="text-cyan-400">[A/D]</span> or <span className="text-cyan-400">[←/→]</span> Move
                <span className="mx-2 md:mx-3 text-cyan-900">|</span>
                <span className="text-cyan-400">[SPACE/W]</span> Shoot
              </span>
              <span className="md:hidden">
                <span className="text-cyan-400">Swipe</span> to move · <span className="text-cyan-400">Tap</span> to shoot
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Start screen */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="text-center p-4">
            {/* Animated title */}
            <div className="relative mb-6 md:mb-8">
              <h1
                className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-600 animate-pulse"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                LOBSTER
              </h1>
              <h2
                className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mt-1 md:mt-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                INVADERS
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-transparent to-cyan-500/20 blur-xl -z-10" />
            </div>

            {/* Lobster emoji decoration */}
            <div className="text-4xl md:text-6xl mb-6 md:mb-8 animate-bounce">
              🦞
            </div>

            <button
              onClick={onStart}
              className="group relative px-6 py-3 md:px-10 md:py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg font-bold text-base md:text-xl text-white tracking-wider uppercase overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-95"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <span className="relative z-10">Start Game</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="text-cyan-700/60 text-xs md:text-sm mt-4 md:mt-6 font-mono max-w-xs mx-auto">
              Defend Earth as the legendary Lobster Guardian against alien invaders!
            </p>
          </div>
        </div>
      )}

      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm">
          <div className="text-center p-4">
            <h1
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-2 md:mb-4"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              GAME OVER
            </h1>

            <div className="mb-4 md:mb-6">
              <p className="text-cyan-500/60 text-xs tracking-widest uppercase mb-2">
                Final Score
              </p>
              <p
                className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {score}
              </p>
              <p className="text-fuchsia-500/60 text-xs mt-2 md:mt-3 tracking-widest uppercase">
                Reached Wave {wave}
              </p>
            </div>

            <button
              onClick={onRestart}
              className="group relative px-6 py-3 md:px-10 md:py-4 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-lg font-bold text-base md:text-xl text-white tracking-wider uppercase overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 active:scale-95"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <span className="relative z-10">Play Again</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
