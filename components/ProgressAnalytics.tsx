
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Goal, PomodoroSession } from '../types';

interface ProgressAnalyticsProps {
  sessions: PomodoroSession[];
  goals: Goal[];
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ sessions, goals }) => {
  // Mock daily aggregation
  const data = [
    { name: 'Seg', minutes: 120, tasks: 4 },
    { name: 'Ter', minutes: 150, tasks: 5 },
    { name: 'Qua', minutes: 90, tasks: 3 },
    { name: 'Qui', minutes: 180, tasks: 6 },
    { name: 'Sex', minutes: 210, tasks: 7 },
    { name: 'Sáb', minutes: 60, tasks: 2 },
    { name: 'Dom', minutes: 45, tasks: 1 },
  ];

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.type === 'work' ? s.duration : 0), 0);
  const completedTasks = goals.filter(g => g.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Foco por Dia (minutos)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff', color: '#1e293b'}}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 150 ? '#6366f1' : '#a5b4fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Metas Concluídas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff', color: '#1e293b'}}
                />
                <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden border border-slate-700 dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Resumo da sua Jornada</h3>
            <p className="text-slate-400">Você já dedicou um total de <span className="text-indigo-400 dark:text-indigo-300 font-bold">{totalMinutes} minutos</span> à sua educação através do FocusFlow.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-6 py-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-indigo-400 dark:text-indigo-300">{completedTasks}</div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Tarefas</div>
            </div>
            <div className="text-center px-6 py-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-emerald-400 dark:text-emerald-300">{sessions.length}</div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Pomodoros</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
