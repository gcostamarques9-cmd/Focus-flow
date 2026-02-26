
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Music } from 'lucide-react';
import { PomodoroSession } from '../types';
import { audioService } from '../services/audioService';

interface PomodoroTimerProps {
  onSessionComplete: (session: PomodoroSession) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const config = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      audioService.playComplete();
      onSessionComplete({
        id: Date.now().toString(),
        duration: config[mode] / 60,
        type: mode,
        timestamp: Date.now()
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete]);

  const toggleTimer = () => {
    if (!isActive) {
      audioService.playStart();
    } else {
      audioService.playPause();
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    audioService.playPause();
    setIsActive(false);
    setTimeLeft(config[mode]);
  };

  const changeMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    audioService.playStart();
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(config[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-in fade-in duration-500">
      <div className="flex gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl">
        <button 
          onClick={() => changeMode('work')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'work' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          Foco
        </button>
        <button 
          onClick={() => changeMode('shortBreak')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'shortBreak' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          Pausa Curta
        </button>
        <button 
          onClick={() => changeMode('longBreak')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'longBreak' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          Pausa Longa
        </button>
      </div>

      <div className={`
        relative w-72 h-72 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500
        ${mode === 'work' ? 'border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]' : 'border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.2)]'}
        bg-white dark:bg-slate-900 dark:border-opacity-50
      `}>
        <div className="flex flex-col items-center">
          {mode === 'work' ? <Brain size={32} className="text-indigo-500 mb-2 animate-pulse-soft" /> : <Coffee size={32} className="text-emerald-500 mb-2" />}
          <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tight tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
            {mode === 'work' ? 'Estudando' : 'Descansando'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={resetTimer}
          title="Reiniciar Timer"
          className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className={`p-6 rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${isActive ? 'bg-slate-800 dark:bg-slate-700' : 'bg-indigo-600 dark:bg-indigo-500'}`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </button>
        <button 
          onClick={() => audioService.playSuccess()} 
          title="Testar Som de Sucesso"
          className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Music size={24} />
        </button>
      </div>

      <div className="text-center max-w-sm">
        <h4 className="text-slate-800 dark:text-slate-100 font-semibold mb-2">Dica de Foco</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Evite multitarefa. Concentre-se apenas em um tópico por vez para maximizar a retenção.
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
