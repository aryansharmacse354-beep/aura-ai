import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import { logger } from './loggerService';

dotenv.config();

const resolvedKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

export const isGeminiKeyProvided = Boolean(resolvedKey && resolvedKey !== 'MOCK_KEY_FOR_LOCAL');

export const ai = new GoogleGenAI({
  apiKey: resolvedKey || 'MOCK_KEY_FOR_LOCAL',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to safely parse JSON responses from Gemini with robust markdown cleaning & fallback support
export function cleanAndParseJSON<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    return JSON.parse(cleaned) as T;
  } catch (e1) {
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const substring = cleaned.substring(firstBrace, lastBrace + 1);
        return JSON.parse(substring) as T;
      }
    } catch (e2) {
      logger.warn('cleanAndParseJSON failed to parse, utilizing structured fallback', { context: 'GeminiService', data: { error: String(e2) } });
    }
    return fallback;
  }
}

// Resilient Gemini Execution with Candidate Cascade & Automatic Retry
export const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

export async function callGeminiResiliently(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
}): Promise<{ text: string; modelUsed: string; isFallback: boolean }> {
  const models = [
    ...(params.preferredModel ? [params.preferredModel] : []),
    ...CANDIDATE_GEMINI_MODELS
  ];

  // If no API key is set, return deterministic fallback immediately
  if (!isGeminiKeyProvided) {
    return {
      text: '',
      modelUsed: 'aura-deterministic-fallback-engine',
      isFallback: true
    };
  }

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });

      if (response && response.text) {
        return {
          text: response.text,
          modelUsed: model,
          isFallback: false
        };
      }
    } catch (err: any) {
      logger.warn(`Query to ${model} received notice: ${err.message || 'Transient network limit'}, attempting cascading candidate...`, { context: 'GeminiService' });
      // Continue to next candidate model in cascade
    }
  }

  return {
    text: '',
    modelUsed: 'aura-deterministic-fallback-engine',
    isFallback: true
  };
}
