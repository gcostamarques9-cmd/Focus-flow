
import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, Lightbulb, Loader2 } from 'lucide-react';
import { getStudyAdvice, generateSmartSchedule } from '../services/geminiService';

interface AICoachProps {
  onScheduleGenerate: (items: any[]) => void;
}

const AICoach: React.FC<AICoachProps> = ({ onScheduleGenerate }) => {
  const [adviceInput, setAdviceInput] = useState('');
  const [difficulty, setDifficulty] = useState('Médio');
  const [advice, setAdvice] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);

  const handleGetAdvice = async () => {
    if (!adviceInput.trim()) return;
    setIsLoading(true);
    const result = await getStudyAdvice(adviceInput, difficulty);
    setAdvice(result);
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    setIsPlanning(true);
    const result = await generateSmartSchedule(goalInput);
    if (result) {
      onScheduleGenerate(result);
    }
    setIsPlanning(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-700 dark:to-violet-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold">Assistente de Estudos IA</h2>
          </div>
          <p className="text-indigo-100 max-w-xl">
            Use o poder da inteligência artificial para otimizar seu aprendizado. Obtenha dicas personalizadas ou crie um cronograma inteligente em segundos.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Advice Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Dicas Personalizadas</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">O que você está estudando?</label>
              <input 
                type="text" 
                value={adviceInput}
                onChange={(e) => setAdviceInput(e.target.value)}
                placeholder="Ex: Física Quântica, Redação ENEM..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nível de Dificuldade</label>
              <div className="flex gap-2">
                {['Fácil', 'Médio', 'Difícil'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${difficulty === d ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleGetAdvice}
              disabled={isLoading || !adviceInput}
              className="w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Obter Estratégia
            </button>
          </div>

          {advice && (
            <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50 animate-in fade-in zoom-in duration-300">
              <div className="prose prose-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {advice}
              </div>
            </div>
          )}
        </div>

        {/* Smart Planner Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Gerador de Cronograma</h3>
          </div>

          <div className="space-y-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Diga-nos seu objetivo principal e nossa IA criará uma estrutura de horários otimizada para você hoje.
            </p>
            
            <textarea 
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Ex: Quero estudar Cálculo 1 das 14h às 18h com pausas intercaladas e foco em exercícios práticos."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[120px] text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />

            <button 
              onClick={handleGeneratePlan}
              disabled={isPlanning || !goalInput}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50"
            >
              {isPlanning ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              Gerar Cronograma IA
            </button>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex gap-3 items-start">
              <div className="mt-1 text-indigo-500"><Sparkles size={16} /></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                O cronograma gerado substituirá sua agenda atual. Recomendamos salvar qualquer informação importante antes de prosseguir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
