import { describe, it, expect } from 'vitest';
import { cleanAndParseJSON } from '../server';

describe('cleanAndParseJSON Utility & Resilient JSON Sanitization', () => {
  it('should return fallback if input is undefined or empty', () => {
    const fallback = { status: 'fallback' };
    expect(cleanAndParseJSON(undefined, fallback)).toEqual(fallback);
    expect(cleanAndParseJSON('', fallback)).toEqual(fallback);
    expect(cleanAndParseJSON('   ', fallback)).toEqual(fallback);
  });

  it('should parse clean JSON strings successfully', () => {
    const raw = JSON.stringify({ aqi: 150, alert: true, city: 'Delhi' });
    const result = cleanAndParseJSON<{ aqi: number; alert: boolean; city: string }>(raw, { aqi: 0, alert: false, city: '' });
    
    expect(result.aqi).toBe(150);
    expect(result.alert).toBe(true);
    expect(result.city).toBe('Delhi');
  });

  it('should parse JSON wrapped in markdown codeblocks (```json ... ```)', () => {
    const markdown = "```json\n{\n  \"model\": \"gemini-3.7-flash\",\n  \"confidence\": 0.94\n}\n```";
    const result = cleanAndParseJSON<{ model: string; confidence: number }>(markdown, { model: '', confidence: 0 });

    expect(result.model).toBe('gemini-3.7-flash');
    expect(result.confidence).toBe(0.94);
  });

  it('should extract valid JSON embedded inside surrounding conversational text', () => {
    const conversationalText = `Here is the simulation result you requested:
    {
      "forecastAQI": 185,
      "riskTier": "Unhealthy"
    }
    Hope this helps your emergency planning.`;

    const result = cleanAndParseJSON<{ forecastAQI: number; riskTier: string }>(conversationalText, { forecastAQI: 0, riskTier: '' });
    expect(result.forecastAQI).toBe(185);
    expect(result.riskTier).toBe('Unhealthy');
  });

  it('should safely return structured fallback when JSON syntax is irrecoverably malformed', () => {
    const corruptedText = "This is not JSON at all: { unclosed brackets and text...";
    const fallback = { error: true, code: 500 };
    const result = cleanAndParseJSON(corruptedText, fallback);
    expect(result).toEqual(fallback);
  });
});
