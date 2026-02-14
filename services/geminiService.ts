
import { GoogleGenAI } from "@google/genai";

export const getComfortMessage = async (reason: string = "生气"): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `用户正在使用一张“允许生气隔夜存档卡”。请提供一句简短、温柔且具有安抚力量的话语（50字以内），肯定他们此刻的情绪并告诉他们：既然已经存档，现在可以安心休息，明天再说。`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    return response.text || "没关系的，先把这份情绪寄存。晚安，明天醒来会是新的一天。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "情绪已安全存档。现在请深呼吸，让这一刻的重担暂时放下。";
  }
};
