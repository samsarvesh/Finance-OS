import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function chatWithTutor(message: string, history: any[] = []) {
  const ai = getGenAI();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are the 'Finance OS' AI Tutor, specialized in Indian Financial Markets. STRICT RULES:\n1. INDIAN CONTEXT: Focus exclusively on Indian finance. Use ₹ (INR) for all currency references.\n2. BENCHMARKS: Use Indian benchmarks like Nifty 50 and BSE Sensex. Do NOT use S&P 500 or Nasdaq unless specifically asked for comparison with Indian markets.\n3. NO HELLOS OR GREETINGS. Do not start with 'Hello', 'Hi', 'Greetings', or any pleasantries.\n4. HIGHLY STRUCTURED DATA: Always use Markdown (H2/H3 headers, bullet points, numbered lists, tables, and bold text) to organize information extensively.\n5. TABLES: When providing comparisons, ALWAYS use standard Markdown tables. Ensure there is a blank line before and after the table for correct rendering.\n6. NO INTRODUCTIONS: Jump straight into the answer for the user's query.\n7. PROFESSIONAL PRECISION: Explain complex finance concepts (from beginner to advanced) with senior-level accuracy but simple, clear language tailored for the Indian regulatory and market environment.",
      }
    });

    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return "I'm having trouble connecting to my financial brain. Please check your connection or try again later.";
  }
}
