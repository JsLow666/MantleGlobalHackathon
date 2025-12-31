// src/ai/factChecker.ts
import { GoogleGenAI } from "@google/genai";
import { logger } from '../utils/logger';
import { getFactCheckPrompt } from './prompts';
import { fetchNewsSources } from './sources';
import { calculateCredibilityScore } from './scorer';
import dotenv from "dotenv";
dotenv.config();


// Initialize Anthropic Claude
const ai = new GoogleGenAI({});

export interface AIAnalysisResult {
  score: number;                    // 0-100 credibility score
  verdict: 'likely_real' | 'likely_fake' | 'uncertain';
  explanation: string;              // Human-readable explanation
  reasoning: string[];              // Key reasoning points
  sources: Array<{                  // Reference sources checked
    name: string;
    url: string;
    relevant: boolean;
  }>;
  confidence: number;               // 0-100 confidence in analysis
  flags: string[];                  // Red flags detected
  timestamp: string;
}

/**
 * Main AI fact-checking function using Claude
 * Analyzes news content and returns credibility assessment
 */
export async function analyzeNews(
  content: string,
  sourceUrl: string,
  title?: string
): Promise<AIAnalysisResult> {
  try {
    logger.info('🤖 Starting AI analysis with Claude...', {
      contentLength: content.length,
      sourceUrl,
      title
    });

    // Step 1: Fetch related news from trusted sources
    const relatedSources = await fetchNewsSources(title || content.substring(0, 100));

    // Step 2: Build comprehensive prompt
    const prompt = getFactCheckPrompt(content, sourceUrl, title, relatedSources);

    const systemPrompt = `You are an expert fact-checker and news analyst. Your job is to analyze news content for credibility, identify misinformation patterns, and provide evidence-based assessments. Be thorough, objective, and cite specific concerns.

You must respond with ONLY valid JSON in this exact format:
{
  "explanation": "A clear, 2-3 sentence summary of your overall assessment",
  "reasoning": [
    "Key point 1 supporting your assessment",
    "Key point 2 supporting your assessment",
    "Key point 3 supporting your assessment"
  ],
  "red_flags": [
    "Any concerning elements (sensationalism, lack of sources, biased language, etc.)"
  ],
  "confidence": 75,
  "supporting_factors": [
    "What makes this more credible"
  ],
  "concerning_factors": [
    "What raises doubts about credibility"
  ],
  "source_reliability": "Assessment of the source domain/publication",
  "fact_check_notes": "Notes about verifiable facts or claims"
}`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    // Step 3: Call Claude API
    const message = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: fullPrompt,
      config: {
      temperature: 0.2,
      },
    });

    // Step 4: Parse Claude response
    const rawResponse = message.text ||'';

    if (!rawResponse) {
      throw new Error('Empty response from Claude');
    }

    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonText = rawResponse;
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const aiResponse = JSON.parse(jsonText);

    // Step 5: Calculate final credibility score
    const score = calculateCredibilityScore(
      aiResponse,
      relatedSources,
      content,
      sourceUrl
    );

    // Step 6: Determine verdict
    const verdict = determineVerdict(score);

    // Step 7: Build result
    const result: AIAnalysisResult = {
      score,
      verdict,
      explanation: aiResponse.explanation || 'Analysis completed.',
      reasoning: aiResponse.reasoning || [],
      sources: relatedSources.map(source => ({
        name: source.name,
        url: source.url,
        relevant: source.relevant
      })),
      confidence: aiResponse.confidence || 70,
      flags: aiResponse.red_flags || [],
      timestamp: new Date().toISOString()
    };

    logger.info('✅ AI analysis completed', {
      score: result.score,
      verdict: result.verdict,
      confidence: result.confidence
    });

    return result;

  } catch (error: any) {
    logger.error('❌ AI analysis failed:', {
      error: error.message,
      stack: error.stack
    });

    // Return fallback result instead of throwing
    return {
      score: 50, // Neutral score
      verdict: 'uncertain',
      explanation: 'Unable to complete analysis due to an error. Please try again.',
      reasoning: ['Analysis service temporarily unavailable'],
      sources: [],
      confidence: 0,
      flags: ['analysis_error'],
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Determine verdict based on score
 */
function determineVerdict(score: number): 'likely_real' | 'likely_fake' | 'uncertain' {
  if (score >= 70) return 'likely_real';
  if (score <= 40) return 'likely_fake';
  return 'uncertain';
}

/**
 * Analyze specific claims within the content
 */
export async function analyzeClaims(content: string): Promise<Array<{
  claim: string;
  verdict: 'true' | 'false' | 'unverifiable';
  explanation: string;
}>> {
  try {
    const message = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following news content and extract specific factual claims:\n\n${content}\n\nRespond with JSON: {"claims": [{"claim": "...", "verdict": "true|false|unverifiable", "explanation": "...", "importance": "high|medium|low"}]}`,
      config: {
      temperature: 0.2,
      },
    });

    const rawResponse = message.text || '{}';

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : '{}';
    
    const response = JSON.parse(jsonText);
    return response.claims || [];

  } catch (error) {
    logger.error('Error analyzing claims:', error);
    return [];
  }
}

/**
 * Quick credibility check (lighter version)
 */
export async function quickCheck(content: string): Promise<number> {
  try {
    const message = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a fact-checker. Rate the credibility of the given news content from 0-100. Respond with just the number. Rate the credibility (0-100): ${content.substring(0, 500)}`,
      config: {
        temperature: 0.2,
      },
    });

     const response = message.text || "50";

    const score = parseInt(response.match(/\d+/)?.[0] || '50', 10);
    return Math.min(100, Math.max(0, score));

  } catch (error) {
    logger.error('Quick check failed:', error);
    return 50;
  }
}

/**
 * Detect misinformation patterns
 */
export async function detectPatterns(content: string): Promise<{
  sensationalism: boolean;
  emotionalLanguage: boolean;
  lackOfSources: boolean;
  clickbait: boolean;
  biasedLanguage: boolean;
}> {
  try {
    const message = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the text for common misinformation patterns. Return only valid JSON with boolean values. Detect patterns in: ${content.substring(0, 1000)}\n\nRespond with JSON: {"sensationalism": bool, "emotionalLanguage": bool, "lackOfSources": bool, "clickbait": bool, "biasedLanguage": bool, "logicalFallacies": [], "manipulativeTactics": [], "notes": "..."}'`,
      config: {
        temperature: 0.2,
      },
    });

    const rawResponse = message.text || '{}';

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : '{}';

    return JSON.parse(jsonText);

  } catch (error) {
    logger.error('Pattern detection failed:', error);
    return {
      sensationalism: false,
      emotionalLanguage: false,
      lackOfSources: false,
      clickbait: false,
      biasedLanguage: false
    };
  }
}