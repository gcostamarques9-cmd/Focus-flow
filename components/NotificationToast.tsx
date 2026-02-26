
import React, { useEffect } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notification: AppNotification;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, notification.duration || 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div className="animate-in slide-in-from-right-full fade-in duration-300 mb-3">
      <div className={`
        w-80 p-4 rounded-2xl shadow-2xl border flex gap-4 relative overflow-hidden
        ${notification.type === 'motivation' 
          ? 'bg-indigo-600 text-white border-indigo-500' 
          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-100 dark:border-slate-800'}
      `}>
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${notification.type === 'motivation' ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'}
        `}>
          {notification.type === 'motivation' ? <Sparkles size={20} /> : <Clock size={20} />}
        </div>
        
        <div className="flex-1 min-w-0 pr-4">
          <h4 className={`text-sm font-bold ${notification.type === 'motivation' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {notification.title}
          </h4>
          <p className={`text-xs mt-1 leading-relaxed ${notification.type === 'motivation' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            {notification.message}
          </p>
        </div>

        <button 
          onClick={() => onClose(notification.id)}
          className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${notification.type === 'motivation' ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
        >
          <X size={14} />
        </button>

        {/* Progress bar for auto-close */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink-width" style={{ animationDuration: `${notification.duration || 5000}ms` }} />
      </div>
    </div>
  );
};

export default NotificationToast;
