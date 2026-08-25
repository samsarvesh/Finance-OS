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

export interface LessonContent {
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
  keyTakeaways: string[];
}

export async function generateLesson(courseTitle: string, level: string): Promise<LessonContent> {
  const ai = getGenAI();
  
  const prompt = `
    Task: Generate a high-quality finance lesson for "${courseTitle}" (${level}). Focus exclusively on Indian Financial Markets (NSE, BSE, SEBI regulations, Indian taxation, Fixed Deposits, PPF, NPS, etc.). Use ₹ (INR) for all currency references. Use Indian benchmarks like Nifty 50 and Sensex where applicable.
    
    Finance Rules Reference (Include these where relevant):
    - Rule of 72/114/144: Time to double/triple/quadruple money (72/Interest Rate).
    - 50/30/20 Rule: 50% Needs, 30% Wants, 20% Savings.
    - Rule of 70: Inflation halving power (70/Inflation Rate).
    - 100 Minus Age: % of portfolio in stocks.
    - 4% Withdrawal Rule: Safe retirement spending rate.
    - Rule of 25: Retirement corpus = 25 * Annual Expenses.
    - 10x Insurance Rule: Life cover = 10 * Annual Income.
    - 40% EMI Rule: Total EMI should not exceed 40% of net income.
    - 30% Credit Utilization: Keep credit usage below 30% of limit.
    - 10-5-3 Rule: Expected returns (stocks 10%, debt 5%, savings 3%).
    - 15-15-15 Rule: 15k SIP for 15 years at 15% return = 1 Crore.
    - 20/4/10 Rule (Car): 20% down payment, 4-year tenure, EMI < 10% income.
    - 50% Car Price Rule: Value of car should be < 50% of annual income.
    - 28% Mortgage Rule: Housing costs < 28% of gross income.
    - 24-Hour/30-Day Rules: Impulse control for small/large purchases.
    - Snowball/Avalanche: Debt payoff methods.
    - 1% Rule (Real Estate): Rent should be ~1% of property price monthly.
    - 2% Rule (Trading): Never risk >2% of capital on a single trade.
    - 5% Rule: No more than 5% exposure to any single stock.
    - Cost Per Use: Price / total times used = real value.
    - Education Loan/Salary Rule: Total debt < expected first-year salary.
    
    Output Format (JSON):
    {
      "title": "string",
      "summary": "1 sentence overview",
      "sections": [
        { "heading": "string", "content": "Markdown content (max 250 words)" }
      ],
      "keyTakeaways": ["string (max 3)"]
    }

    Requirements:
    - Use professional, clear language.
    - Return ONLY the JSON object.
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
    return safeJsonParse<LessonContent>(text);
  } catch (error) {
    console.error("Failed to generate lesson:", error);
    throw new Error("Could not load lesson content.");
  }
}
