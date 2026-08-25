import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { safeJsonParse } from "./aiUtils";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
  resourceType: 'Lesson' | 'Project' | 'Quiz';
}

export interface Roadmap {
  goal: string;
  level: string;
  estimatedTime: string;
  curriculum: string;
  pace: string;
  steps: RoadmapStep[];
}

export async function generateRoadmap(goal: string, currentKnowledge: string): Promise<Roadmap> {
  const ai = getGenAI();
  
  const prompt = `
    Create a personalized financial learning roadmap for a user who wants to achieve: "${goal}".
    Their current knowledge level is: "${currentKnowledge}".
    
    Guideline: Focus exclusively on Indian Financial Markets (NSE, BSE, SEBI regulations, Indian taxation, Fixed Deposits, PPF, NPS, etc.). Use ₹ (INR) for all currency references. Incorporate relevant financial thumb rules (e.g., Rule of 72, 50/30/20, 100 Minus Age, etc.) as key milestones or lessons within the steps.
    
    Return as JSON:
    {
      "goal": "string",
      "level": "string",
      "estimatedTime": "string",
      "curriculum": "string (A brief summary of what will be covered)",
      "pace": "string (Recommended intensity, e.g., '2 hours/week' or 'Aggressive')",
      "steps": [
        {
          "title": "string",
          "description": "string",
          "duration": "string",
          "resourceType": "Lesson | Project | Quiz"
        }
      ]
    }
    
    Provide 6-8 logical steps transitioning from their current knowledge to their goal.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    return safeJsonParse<Roadmap>(text);
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    throw new Error("Could not generate roadmap.");
  }
}
