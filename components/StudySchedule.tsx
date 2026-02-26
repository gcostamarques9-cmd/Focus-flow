
import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { ScheduleItem } from '../types';

interface StudyScheduleProps {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
}

const StudySchedule: React.FC<StudyScheduleProps> = ({ schedule, setSchedule }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<ScheduleItem['category']>('Estudo');

  const addItem = () => {
    if (!newTime || !newSubject) return;
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      time: newTime,
      subject: newSubject,
      category: newCategory
    };
    setSchedule(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
    setNewTime('');
    setNewSubject('');
  };

  const removeItem = (id: string) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Estudo': return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400';
      case 'Revisão': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400';
      case 'Exercícios': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400';
      case 'Pausa': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      default: return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar size={24} className="text-indigo-500" />
            Cronograma do Dia
          </h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            <Plus size={18} />
            Adicionar Bloco
          </button>
        </div>

        {isAdding && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <input 
              type="time" 
              value={newTime} 
              onChange={(e) => setNewTime(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            />
            <input 
              type="text" 
              placeholder="Assunto / Matéria"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            />
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            >
              <option value="Estudo">Estudo</option>
              <option value="Revisão">Revisão</option>
              <option value="Exercícios">Exercícios</option>
              <option value="Pausa">Pausa</option>
            </select>
            <div className="flex gap-2">
              <button onClick={addItem} className="flex-1 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">OK</button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">X</button>
            </div>
          </div>
        )}

        <div className="relative space-y-4">
          <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
          
          {schedule.map((item) => (
            <div key={item.id} className="relative flex items-start gap-6 group">
              <div className="mt-2 z-10 w-3 h-3 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 shadow-sm ring-4 ring-indigo-50 dark:ring-indigo-900/30"></div>
              
              <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold min-w-[70px]">
                    <Clock size={16} />
                    {item.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.subject}</h4>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {schedule.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 dark:text-slate-500 italic">Seu cronograma está vazio. Planeje seu dia!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySchedule;
