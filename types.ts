
export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  category: 'Estudo' | 'Revisão' | 'Exercícios' | 'Pausa';
}

export interface PomodoroSession {
  id: string;
  duration: number; // in minutes
  type: 'work' | 'shortBreak' | 'longBreak';
  timestamp: number;
}

export interface ProgressData {
  day: string;
  minutes: number;
  tasks: number;
}

export interface Track {
  id: string;
  title: string;
  author: string;
  url: string;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'reminder';
  duration?: number;
}

export type Theme = 'light' | 'dark';

export type Tab = 'dashboard' | 'timer' | 'schedule' | 'goals' | 'progress' | 'ai';
