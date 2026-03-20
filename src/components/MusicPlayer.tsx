import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Cybernetic Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Electric Pulse",
    artist: "Digital Nomad",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-black/80 p-6 glitch-border relative overflow-hidden">
      <div className="absolute inset-0 static-bg opacity-10 pointer-events-none" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="relative w-24 h-24 flex-shrink-0 border-2 border-glitch-magenta">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover grayscale contrast-150 ${isPlaying ? 'animate-pulse' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-glitch-cyan/20 mix-blend-overlay" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-glitch-magenta truncate glitch-text uppercase tracking-tighter">
            {currentTrack.title}
          </h3>
          <p className="text-glitch-cyan/60 text-sm truncate uppercase tracking-[0.2em]">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <div className="h-2 w-full bg-glitch-cyan/10 border border-glitch-cyan/30 overflow-hidden">
          <div 
            className="h-full bg-glitch-magenta shadow-[0_0_10px_#ff00ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={skipBackward} className="p-2 text-glitch-cyan hover:text-glitch-magenta transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-glitch-cyan text-black border-2 border-glitch-magenta hover:bg-glitch-magenta hover:text-white transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={skipForward} className="p-2 text-glitch-cyan hover:text-glitch-magenta transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex flex-col items-end gap-1 opacity-60">
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-glitch-cyan" />
            <span className="text-[10px] text-glitch-cyan uppercase tracking-widest">AMP_LEVEL</span>
          </div>
          <div className="w-20 h-1 bg-glitch-cyan/20">
            <div className="w-2/3 h-full bg-glitch-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
};
