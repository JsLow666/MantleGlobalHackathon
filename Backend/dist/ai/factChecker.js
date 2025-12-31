"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNews = analyzeNews;
exports.analyzeClaims = analyzeClaims;
exports.quickCheck = quickCheck;
exports.detectPatterns = detectPatterns;
// src/ai/factChecker.ts
const genai_1 = require("@google/genai");
const logger_1 = require("../utils/logger");
const prompts_1 = require("./prompts");
const sources_1 = require("./sources");
const scorer_1 = require("./scorer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Anthropic Claude
const ai = new genai_1.GoogleGenAI({});
/**
 * Main AI fact-checking function using Claude
 * Analyzes news content and returns credibility assessment
 */
async function analyzeNews(content, sourceUrl, title) {
    try {
        logger_1.logger.info('🤖 Starting AI analysis with Claude...', {
            contentLength: content.length,
            sourceUrl,
            title
        });
        // Step 1: Fetch related news from trusted sources
        const relatedSources = await (0, sources_1.fetchNewsSources)(title || content.substring(0, 100));
        // Step 2: Build comprehensive prompt
        const prompt = (0, prompts_1.getFactCheckPrompt)(content, sourceUrl, title, relatedSources);
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
        const rawResponse = message.text || '';
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
        const score = (0, scorer_1.calculateCredibilityScore)(aiResponse, relatedSources, content, sourceUrl);
        // Step 6: Determine verdict
        const verdict = determineVerdict(score);
        // Step 7: Build result
        const result = {
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
        logger_1.logger.info('✅ AI analysis completed', {
            score: result.score,
            verdict: result.verdict,
            confidence: result.confidence
        });
        return result;
    }
    catch (error) {
        logger_1.logger.error('❌ AI analysis failed:', {
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
function determineVerdict(score) {
    if (score >= 70)
        return 'likely_real';
    if (score <= 40)
        return 'likely_fake';
    return 'uncertain';
}
/**
 * Analyze specific claims within the content
 */
async function analyzeClaims(content) {
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
    }
    catch (error) {
        logger_1.logger.error('Error analyzing claims:', error);
        return [];
    }
}
/**
 * Quick credibility check (lighter version)
 */
async function quickCheck(content) {
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
    }
    catch (error) {
        logger_1.logger.error('Quick check failed:', error);
        return 50;
    }
}
/**
 * Detect misinformation patterns
 */
async function detectPatterns(content) {
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
    }
    catch (error) {
        logger_1.logger.error('Pattern detection failed:', error);
        return {
            sensationalism: false,
            emotionalLanguage: false,
            lackOfSources: false,
            clickbait: false,
            biasedLanguage: false
        };
    }
}
