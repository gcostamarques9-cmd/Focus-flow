
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Lofi Study Beats',
    author: 'FocusFlow Mix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: 'bg-indigo-500'
  },
  {
    id: '2',
    title: 'Coffee Shop Jazz',
    author: 'Chill Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: 'bg-amber-500'
  },
  {
    id: '3',
    title: 'Rainy Night Ambient',
    author: 'Nature Sounds',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: 'bg-blue-500'
  },
  {
    id: '4',
    title: 'Deep Focus Alpha',
    author: 'Ambient Brainwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    color: 'bg-emerald-500'
  }
];

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sincroniza Volume e Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Efeito unificado para gerenciar play/pause e troca de fontes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Autoplay bloqueado ou erro de carregamento:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack.url]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isOpen ? 'w-80' : 'w-14 h-14'}`}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        loop 
        preload="auto"
      />
      
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all animate-pulse-soft"
        >
          <Music size={24} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-4 bg-slate-900 dark:bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${currentTrack.color} rounded-xl flex items-center justify-center transition-all duration-300`}>
                <Music size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold truncate w-32">{currentTrack.title}</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{currentTrack.author}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={togglePlay}
                className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Escolha sua Vibe</p>
              {TRACKS.map(track => (
                <button 
                  key={track.id}
                  onClick={(e) => selectTrack(track, e)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${currentTrack.id === track.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'}`}
                >
                  <div className={`w-8 h-8 ${track.color} rounded-lg flex items-center justify-center text-white shadow-sm shrink-0`}>
                    <Music size={14} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h5 className={`text-sm font-semibold truncate ${currentTrack.id === track.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {track.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate">{track.author}</p>
                  </div>
                  {currentTrack.id === track.id && isPlaying && (
                    <div className="flex gap-0.5 items-end h-3 shrink-0">
                      <div className="w-0.5 h-full bg-indigo-500 animate-[bounce_0.6s_infinite_ease-in-out]"></div>
                      <div className="w-0.5 h-2/3 bg-indigo-500 animate-[bounce_0.8s_infinite_ease-in-out]"></div>
                      <div className="w-0.5 h-full bg-indigo-500 animate-[bounce_0.7s_infinite_ease-in-out]"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
