/**
 * Cleans and parses JSON from AI responses that might contain markdown blocks or trailing text.
 */
export function safeJsonParse<T>(text: string): T {
  try {
    // Attempt direct parse first
    return JSON.parse(text) as T;
  } catch (e) {
    // Find the first and last structural characters
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    
    let firstIndex = -1;
    let lastIndex = -1;
    let isArray = false;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      firstIndex = firstBrace;
      lastIndex = text.lastIndexOf('}');
      isArray = false;
    } else if (firstBracket !== -1) {
      firstIndex = firstBracket;
      lastIndex = text.lastIndexOf(']');
      isArray = true;
    }

    if (firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
      let cleaned = text.substring(firstIndex, lastIndex + 1);
      
      try {
        return JSON.parse(cleaned) as T;
      } catch (innerError) {
        // AI sometimes returns multiple { objects } separated by commas without []
        if (!isArray && (text.includes('},') || text.includes('}\n{'))) {
          try {
            // Attempt to wrap if it looks like a list of objects
            const wrapped = `[${cleaned.replace(/}\s*{/g, '},{')}]`;
            return JSON.parse(wrapped) as T;
          } catch (wrapError) {
             // Continue to throw original innerError
          }
        }
        
        // Final attempt: if it's truncated (Unexpected end of JSON), try to close brackets
        if (innerError instanceof Error && innerError.message.toLowerCase().includes('end of json')) {
           try {
             let fixed = cleaned;
             if (isArray && !fixed.endsWith(']')) fixed += ']';
             if (!isArray && !fixed.endsWith('}')) fixed += '}';
             return JSON.parse(fixed) as T;
           } catch (fixError) {
             // Continue
           }
        }

        console.error("Failed to parse cleaned JSON:", cleaned);
        throw innerError;
      }
    }
    
    throw e;
  }
}
