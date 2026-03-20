import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Music, Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* CRT & Static Overlays */}
      <div className="absolute inset-0 crt-lines pointer-events-none z-50 opacity-30" />
      <div className="absolute inset-0 static-bg pointer-events-none z-40" />
      <div className="scanline z-50" />
      
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter glitch-text uppercase">
          <span className="text-glitch-cyan">GLITCH</span>
          <span className="text-glitch-magenta">_SNAKE</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[2px] w-16 bg-glitch-magenta" />
          <p className="text-glitch-cyan text-sm uppercase tracking-[0.5em] font-bold">TERMINAL_V.01</p>
          <div className="h-[2px] w-16 bg-glitch-magenta" />
        </div>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Sidebar - Stats/Info */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 flex flex-col gap-4"
        >
          <div className="bg-black/60 p-6 glitch-border flex items-center gap-4">
            <div className="p-3 bg-glitch-magenta/20 text-glitch-magenta">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-glitch-cyan/60">DATA_VALUE</p>
              <p className="text-4xl font-bold text-glitch-cyan tabular-nums glitch-text">{score}</p>
            </div>
          </div>

          <div className="bg-black/60 p-6 glitch-border">
            <div className="flex items-center gap-2 mb-4 text-glitch-magenta">
              <Gamepad2 size={18} />
              <h3 className="text-xs uppercase tracking-widest font-bold">OPERATIONAL_GUIDE</h3>
            </div>
            <ul className="text-xs space-y-2 text-glitch-cyan/80 leading-relaxed uppercase tracking-wider">
              <li>[UP/DN/LF/RT]: NAVIGATE</li>
              <li>[MAGENTA_NODE]: ABSORB</li>
              <li>[COLLISION]: TERMINATE</li>
              <li>[SPACE]: HALT_PROCESS</li>
            </ul>
          </div>
        </motion.div>

        {/* Center - Game Window */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-glitch-magenta/20 blur-xl animate-pulse" />
            <SnakeGame onScoreChange={setScore} />
          </div>
        </motion.div>

        {/* Right Sidebar - Music Player */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 px-2 text-glitch-magenta">
            <Music size={18} />
            <h3 className="text-xs uppercase tracking-widest font-bold">AUDIO_STREAM</h3>
          </div>
          <MusicPlayer />
          
          <div className="mt-4 p-4 bg-glitch-cyan/5 border border-glitch-cyan/20 text-[10px] leading-relaxed text-glitch-cyan/40 text-center uppercase tracking-widest">
            SYSTEM_STATUS: OPERATIONAL. ALL_PROCESSES_SYNCED.
          </div>
        </motion.div>
      </main>

      <footer className="mt-12 text-[10px] uppercase tracking-[1em] text-glitch-magenta/30 hover:text-glitch-magenta transition-colors duration-500 cursor-none">
        &copy; 2026 // NEURAL_INTERFACE // ARTIFACT_001
      </footer>
    </div>
  );
}
