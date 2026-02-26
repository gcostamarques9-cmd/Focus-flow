
import { AppNotification } from '../types';

const MOTIVATIONAL_QUOTES = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Sua única limitação é aquela que você impõe em sua própria mente.",
  "O esforço de hoje é a conquista de amanhã.",
  "Não pare até se orgulhar de você mesmo.",
  "Grandes coisas nunca vêm de zonas de conforto.",
  "Você é capaz de aprender qualquer coisa que se propuser.",
  "A disciplina é a ponte entre metas e realizações.",
  "Cada minuto de estudo é um degrau rumo ao seu sonho."
];

const REMINDERS = [
  "Que tal uma sessão de 25 minutos de foco agora?",
  "Hora de dar uma olhada nas suas metas do dia!",
  "Não deixe seu cronograma acumular, vamos estudar?",
  "A consistência é o segredo do aprendizado. Vamos focar?"
];

export const getMotivationalQuote = (): AppNotification => {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: "Motivação do Momento",
    message: quote,
    type: 'motivation',
    duration: 6000
  };
};

export const getStudyReminder = (): AppNotification => {
  const reminder = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: "Lembrete de Foco",
    message: reminder,
    type: 'reminder',
    duration: 8000
  };
};

export const requestBrowserPermission = async () => {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendSystemNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
};
