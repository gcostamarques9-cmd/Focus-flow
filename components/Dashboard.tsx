
import React from 'react';
import { ChevronRight, Clock, CheckCircle, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Goal, ScheduleItem, PomodoroSession, Tab } from '../types';

interface DashboardProps {
  goals: Goal[];
  schedule: ScheduleItem[];
  sessions: PomodoroSession[];
  onNavigate: (tab: Tab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ goals, schedule, sessions, onNavigate }) => {
  const completedGoals = goals.filter(g => g.completed).length;
  const totalStudyTime = sessions.reduce((acc, s) => acc + (s.type === 'work' ? s.duration : 0), 0);
  const nextTask = schedule[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tempo Estudado</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudyTime} min</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Metas Concluídas</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{completedGoals}/{goals.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sessões Pomodoro</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{sessions.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next up */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <CalendarIcon size={20} className="text-indigo-500" />
              Próxima Atividade
            </h3>
            <button onClick={() => onNavigate('schedule')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline">
              Ver tudo <ChevronRight size={16} />
            </button>
          </div>
          
          {nextTask ? (
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-center px-4 py-2 border-r border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 uppercase">Hoje</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{nextTask.time}</p>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{nextTask.subject}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{nextTask.category}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-center py-4 italic">Nenhuma atividade agendada.</p>
          )}
        </div>

        {/* Quick Goals */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Metas do Dia
            </h3>
            <button onClick={() => onNavigate('goals')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline">
              Gerenciar <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${goal.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {goal.completed && <CheckCircle size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${goal.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                  {goal.text}
                </span>
              </div>
            ))}
            {goals.length === 0 && <p className="text-slate-400 dark:text-slate-500 text-center py-4 italic">Defina metas para hoje!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
