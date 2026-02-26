
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  Calendar, 
  CheckCircle2, 
  BarChart3, 
  Sparkles,
  Settings,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  BellRing
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PomodoroTimer from './components/PomodoroTimer';
import StudySchedule from './components/StudySchedule';
import DailyGoals from './components/DailyGoals';
import ProgressAnalytics from './components/ProgressAnalytics';
import AICoach from './components/AICoach';
import MusicPlayer from './components/MusicPlayer';
import NotificationToast from './components/NotificationToast';
import { Tab, Goal, ScheduleItem, PomodoroSession, Theme, AppNotification } from './types';
import { getMotivationalQuote, getStudyReminder, requestBrowserPermission, sendSystemNotification } from './services/notificationService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('focusflow_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('focusflow_goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('focusflow_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '09:00', subject: 'Matemática - Álgebra', category: 'Estudo' },
      { id: '2', time: '11:00', subject: 'História - Brasil Colônia', category: 'Revisão' },
    ];
  });
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('focusflow_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Gerenciador de notificações locais
  const addNotification = useCallback((notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev.slice(0, 2)]); // Máximo 3 na tela
    if (browserNotificationsEnabled) {
      sendSystemNotification(notif.title, notif.message);
    }
  }, [browserNotificationsEnabled]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Efeito para Notificações Motivacionais Periódicas
  useEffect(() => {
    const interval = setInterval(() => {
      // Chance de 70% de ser motivação, 30% lembrete
      const isMotivation = Math.random() > 0.3;
      addNotification(isMotivation ? getMotivationalQuote() : getStudyReminder());
    }, 180000); // A cada 3 minutos (reduzido para demonstração rápida, ideal seriam 15-20min)
    
    return () => clearInterval(interval);
  }, [addNotification]);

  // Tema
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('focusflow_theme', theme);
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Persistência
  useEffect(() => { localStorage.setItem('focusflow_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('focusflow_schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('focusflow_sessions', JSON.stringify(sessions)); }, [sessions]);

  const handleToggleBrowserNotif = async () => {
    const granted = await requestBrowserPermission();
    setBrowserNotificationsEnabled(granted);
    if (granted) {
      addNotification({
        id: 'welcome-notif',
        title: 'Notificações Ativas!',
        message: 'Você receberá avisos motivacionais e lembretes de estudo agora.',
        type: 'reminder',
        duration: 4000
      });
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer', label: 'Pomodoro', icon: Timer },
    { id: 'schedule', label: 'Cronograma', icon: Calendar },
    { id: 'goals', label: 'Metas', icon: CheckCircle2 },
    { id: 'progress', label: 'Progresso', icon: BarChart3 },
    { id: 'ai', label: 'IA Coach', icon: Sparkles },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard goals={goals} schedule={schedule} sessions={sessions} onNavigate={setActiveTab} />;
      case 'timer': return <PomodoroTimer onSessionComplete={(s) => {
        setSessions([...sessions, s]);
        addNotification({
          id: Date.now().toString(),
          title: "Sessão Finalizada!",
          message: "Parabéns por completar seu bloco de estudo. Hora de uma pequena pausa!",
          type: 'motivation'
        });
      }} />;
      case 'schedule': return <StudySchedule schedule={schedule} setSchedule={setSchedule} />;
      case 'goals': return <DailyGoals goals={goals} setGoals={setGoals} />;
      case 'progress': return <ProgressAnalytics sessions={sessions} goals={goals} />;
      case 'ai': return <AICoach onScheduleGenerate={(items) => {
        setSchedule(items.map((it: any, idx: number) => ({ ...it, id: String(Date.now() + idx), category: 'Estudo' })));
        setActiveTab('schedule');
        addNotification({
          id: 'ai-gen',
          title: "Cronograma Gerado",
          message: "A IA Coach planejou seu dia com maestria. Mãos à obra!",
          type: 'reminder'
        });
      }} />;
      default: return <Dashboard goals={goals} schedule={schedule} sessions={sessions} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden`}>
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col pointer-events-none">
        {notifications.map(notif => (
          <div key={notif.id} className="pointer-events-auto">
            <NotificationToast notification={notif} onClose={removeNotification} />
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Sparkles size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">FocusFlow</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
                `}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Settings size={20} />
              Configurações
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white capitalize">
              {activeTab === 'dashboard' ? 'Bem-vindo, Estudante' : navigation.find(n => n.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const isMotivation = Math.random() > 0.5;
                addNotification(isMotivation ? getMotivationalQuote() : getStudyReminder());
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full relative">
          {renderContent()}
        </div>
        
        <MusicPlayer />
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Configurações</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tema Visual</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-inner' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'}`}
                  >
                    <Sun size={24} className={theme === 'light' ? 'text-indigo-600' : ''} />
                    <span className="font-semibold">Claro</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-inner' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'}`}
                  >
                    <Moon size={24} className={theme === 'dark' ? 'text-indigo-400' : ''} />
                    <span className="font-semibold">Escuro</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Alertas e Sistema</label>
                <div className="space-y-3">
                   <button 
                    onClick={handleToggleBrowserNotif}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                   >
                      <div className="flex items-center gap-3">
                        <BellRing size={20} className={browserNotificationsEnabled ? 'text-indigo-500' : 'text-slate-400'} />
                        <span className="text-slate-700 dark:text-slate-200 font-medium">Notificações do Navegador</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${browserNotificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${browserNotificationsEnabled ? 'right-1' : 'left-1'}`} />
                      </div>
                   </button>
                   <p className="text-[10px] text-slate-400 px-1">Ative para receber lembretes motivacionais mesmo fora do app.</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
