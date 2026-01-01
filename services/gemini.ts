
import { GoogleGenAI } from "@google/genai";
import { SERVICES, EDUCATION, EXPERIENCE, SKILLS, PROJECTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for Akash Prasad Barai. 
Akash is a 6th-semester BSc. CSIT student at Bhairahawa Multiple Campus, Nepal.
Your goal is to answer questions about him professionally and enthusiastically.

Context:
- Services: ${JSON.stringify(SERVICES)}
- Education: ${JSON.stringify(EDUCATION)}
- Experience: ${JSON.stringify(EXPERIENCE)}
- Skills: ${JSON.stringify(SKILLS)}
- Projects: ${JSON.stringify(PROJECTS)}

Always speak as if you are helping a potential employer or collaborator. Keep answers concise.
If asked about something not in his portfolio, politely say you only know about his professional background.
`;

export async function askGemini(prompt: string) {
  if (!process.env.API_KEY) return "AI Assistant is currently offline (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong with my AI processing.";
  }
}
