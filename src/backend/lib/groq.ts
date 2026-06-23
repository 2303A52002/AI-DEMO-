import { Groq } from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

export const groq = new Groq({
  apiKey: apiKey || 'dummy-key-to-avoid-sdk-crash',
});

export interface PredictResult {
  collegeId: string;
  collegeName: string;
  reason: string;
  fitScore: number;
}

/**
 * Extracts and parses a JSON array of predictions from the raw Groq response.
 * Handles cases where the model wraps JSON in markdown blocks or appends conversational text.
 */
export function extractJSONArray<T>(rawText: string): T[] {
  const trimmed = rawText.trim();
  
  // 1. Direct JSON Parse attempt
  try {
    return JSON.parse(trimmed) as T[];
  } catch {
    // Proceed to extraction methods
  }

  // 2. Extract content between first '[' and last ']'
  const startIdx = trimmed.indexOf('[');
  const endIdx = trimmed.lastIndexOf(']');
  
  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const extracted = trimmed.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(extracted) as T[];
    } catch (err) {
      console.error('Failed to parse content between outer brackets:', err);
    }
  }

  // 3. Fallback: Parse line-by-line or regex match for individual objects
  // If parsing fails entirely, return an empty array and log the failure
  console.error('Groq JSON response was not parseable. Raw text was:', rawText);
  throw new Error('Could not parse Groq AI response as JSON. Please try again.');
}
