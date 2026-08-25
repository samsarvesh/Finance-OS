import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { safeJsonParse } from "./aiUtils";

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

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export async function generateQuiz(topic: string, difficulty: string, count: number = 5, excludeContext?: string): Promise<MCQ[]> {
  const ai = getGenAI();

  const prompt = `
    Task: Generate ${count} UNIQUE and NON-REPETITIVE finance MCQs for "${topic}" at ${difficulty} level. Focus exclusively on Indian Financial Markets (NSE, BSE, SEBI regulations, Indian taxation like Income Tax Act, GST, Fixed Deposits, PPF, NPS, etc.). Use ₹ (INR) for all currency references. Use Indian benchmarks like Nifty 50 and Sensex where applicable.
    
    Finance Rules Reference (Use for rules-based questions):
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

    Difficulty Context:
    - Noob: Absolute basics, common knowledge.
    - Mid: Standard concepts, definitions.
    - Pro: Deeper analysis, practical calculations.
    - Extreme: Complex scenarios, inter-domain links.
    - God Tier: Highly technical, obscure niche cases, master-level professional knowledge.

    ${excludeContext ? `CONSTRAINTS: Avoid these specific sub-topics or question types already seen: ${excludeContext}` : ''}
    
    Variety Requirement:
    - We need a pool of 1000+ distinct questions for this module. 
    - Dig deep into the topic. Avoid the most common "textbook" questions.
    - Explore niche regulations, historic market events, complex mathematical edge cases, and cross-disciplinary impacts.

    Output Format (STRICT JSON ARRAY):
    [
      {
        "question": "string",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Detailed explanation of why the correct answer is right and why others are wrong.",
        "difficulty": "${difficulty}"
      }
    ]

    Requirements:
    - Return ONLY the JSON array.
    - Ensure exactly 4 options per question.
    - Focus on accuracy and educational value.
    - Ensure questions are fresh and not commonly repetitive.
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
    return safeJsonParse<MCQ[]>(text);
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw new Error("AI could not generate the quiz at this moment.");
  }
}
