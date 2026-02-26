
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyAdvice = async (subject: string, difficulty: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sou um estudante focado em ${subject} e estou sentindo que o nível de dificuldade é ${difficulty}. Me dê 3 dicas práticas e curtas para melhorar meu rendimento hoje.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível carregar as dicas da IA no momento. Continue focado!";
  }
};

export const generateSmartSchedule = async (goal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie um cronograma de estudos para o objetivo: "${goal}". Retorne um array JSON de objetos com "time" (formato HH:MM) e "subject" (breve descrição).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              subject: { type: Type.STRING }
            },
            required: ["time", "subject"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
