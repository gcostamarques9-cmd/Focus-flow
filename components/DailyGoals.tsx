
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Goal } from '../types';
import { audioService } from '../services/audioService';

interface DailyGoalsProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const DailyGoals: React.FC<DailyGoalsProps> = ({ goals, setGoals }) => {
  const [inputValue, setInputValue] = useState('');

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      createdAt: Date.now()
    };
    setGoals([newGoal, ...goals]);
    setInputValue('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newState = !g.completed;
        if (newState) {
          audioService.playSuccess();
        }
        return { ...g, completed: newState };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Minhas Metas</h3>
        
        <form onSubmit={addGoal} className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="O que você quer aprender hoje?"
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className={`flex items-center group gap-4 p-4 rounded-xl border transition-all ${goal.completed ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-sm'}`}
            >
              <button 
                onClick={() => toggleGoal(goal.id)}
                className={`transition-colors ${goal.completed ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600 hover:text-indigo-400'}`}
              >
                {goal.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <span className={`flex-1 font-medium transition-all ${goal.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                {goal.text}
              </span>

              <button 
                onClick={() => deleteGoal(goal.id)}
                className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {goals.length === 0 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Nenhuma meta definida. Que tal começar agora?</p>
            </div>
          )}
        </div>
      </div>
      
      {goals.length > 0 && (
        <div className="bg-indigo-600 dark:bg-indigo-500 p-6 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-indigo-100 dark:shadow-none overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="font-bold">Progresso Diário</h4>
            <p className="text-indigo-100 text-sm">Continue assim, você está quase lá!</p>
          </div>
          <div className="text-3xl font-black relative z-10">
            {Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%
          </div>
          <div 
            className="absolute inset-y-0 left-0 bg-white/10 transition-all duration-500 ease-out"
            style={{ width: `${(goals.filter(g => g.completed).length / goals.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
