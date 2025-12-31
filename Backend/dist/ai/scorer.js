"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCredibilityScore = calculateCredibilityScore;
exports.interpretScore = interpretScore;
exports.calculateConfidenceLevel = calculateConfidenceLevel;
// src/ai/scorer.ts
const sources_1 = require("./sources");
/**
 * Calculate final credibility score using multiple factors
 *
 * Scoring factors:
 * - AI confidence: 40%
 * - Source reputation: 25%
 * - Content quality: 20%
 * - Corroboration: 15%
 */
function calculateCredibilityScore(aiResponse, relatedSources, content, sourceUrl) {
    let score = 0;
    // Factor 1: AI Confidence (40 points max)
    const aiConfidence = aiResponse.confidence || 70;
    score += (aiConfidence / 100) * 40;
    // Factor 2: Source Reputation (25 points max)
    const domainRep = (0, sources_1.getDomainReputation)(sourceUrl);
    score += (domainRep.score / 100) * 25;
    // Factor 3: Content Quality Analysis (20 points max)
    const contentScore = analyzeContentQuality(content, aiResponse);
    score += contentScore * 20;
    // Factor 4: Corroboration by Trusted Sources (15 points max)
    const corroborationScore = analyzeCorroboration(relatedSources);
    score += corroborationScore * 15;
    // Apply penalties for red flags
    const redFlagPenalty = calculateRedFlagPenalty(aiResponse.red_flags || []);
    score = Math.max(0, score - redFlagPenalty);
    // Apply bonuses for supporting factors
    const supportingBonus = calculateSupportingBonus(aiResponse.supporting_factors || []);
    score = Math.min(100, score + supportingBonus);
    // Round to integer
    return Math.round(score);
}
/**
 * Analyze content quality indicators
 * Returns score from 0-1
 */
function analyzeContentQuality(content, aiResponse) {
    let score = 0.5; // Start at neutral
    // Length check (very short or very long content may be suspicious)
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 200 && wordCount <= 2000) {
        score += 0.1;
    }
    else if (wordCount < 50 || wordCount > 5000) {
        score -= 0.1;
    }
    // Check for proper structure (paragraphs)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 3) {
        score += 0.1;
    }
    // Check for URLs/citations in content
    const urlCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (urlCount > 0 && urlCount <= 10) {
        score += 0.15;
    }
    // Check for quotes (indicates attribution)
    const quoteCount = (content.match(/[""].*?[""]|["'].*?["']/g) || []).length;
    if (quoteCount > 0) {
        score += 0.1;
    }
    // Check for excessive capitalization (shouting)
    const capsWords = content.match(/\b[A-Z]{3,}\b/g) || [];
    if (capsWords.length > 5) {
        score -= 0.15;
    }
    // Check for excessive punctuation (!!! or ???)
    const excessivePunct = content.match(/[!?]{2,}/g) || [];
    if (excessivePunct.length > 3) {
        score -= 0.1;
    }
    return Math.max(0, Math.min(1, score));
}
/**
 * Analyze corroboration from related sources
 * Returns score from 0-1
 */
function analyzeCorroboration(relatedSources) {
    if (relatedSources.length === 0) {
        return 0.3; // No corroboration available (neutral-low)
    }
    let score = 0;
    // More sources = better corroboration
    const sourceCount = relatedSources.length;
    if (sourceCount >= 5) {
        score += 0.5;
    }
    else if (sourceCount >= 3) {
        score += 0.4;
    }
    else {
        score += 0.3;
    }
    // Check if sources are from trusted domains
    const trustedCount = relatedSources.filter(s => (0, sources_1.isTrustedSource)(s.url)).length;
    const trustedRatio = trustedCount / sourceCount;
    score += trustedRatio * 0.5;
    return Math.min(1, score);
}
/**
 * Calculate penalty for red flags
 * Returns penalty value (0-30)
 */
function calculateRedFlagPenalty(redFlags) {
    if (redFlags.length === 0)
        return 0;
    let penalty = 0;
    // Define severity of different red flags
    const severityMap = {
        'no_source_attribution': 15,
        'extreme_bias': 12,
        'sensationalism': 10,
        'clickbait_headline': 8,
        'emotional_manipulation': 10,
        'lack_of_evidence': 12,
        'conspiracy_theory': 15,
        'misleading_statistics': 12,
        'out_of_context': 10,
        'anonymous_source_only': 8,
        'contradicts_known_facts': 20,
        'satire_misrepresented': 15
    };
    redFlags.forEach(flag => {
        const flagLower = flag.toLowerCase().replace(/\s+/g, '_');
        penalty += severityMap[flagLower] || 5; // Default penalty: 5
    });
    return Math.min(30, penalty); // Cap at 30 points
}
/**
 * Calculate bonus for supporting factors
 * Returns bonus value (0-15)
 */
function calculateSupportingBonus(supportingFactors) {
    if (supportingFactors.length === 0)
        return 0;
    let bonus = 0;
    // Define value of different supporting factors
    const valueMap = {
        'multiple_sources_cited': 5,
        'expert_quotes': 4,
        'verified_data': 5,
        'transparent_methodology': 3,
        'recent_publication': 2,
        'author_credentials': 3,
        'fact_check_available': 5,
        'primary_sources': 4,
        'balanced_perspective': 3,
        'context_provided': 3
    };
    supportingFactors.forEach(factor => {
        const factorLower = factor.toLowerCase().replace(/\s+/g, '_');
        bonus += valueMap[factorLower] || 2; // Default bonus: 2
    });
    return Math.min(15, bonus); // Cap at 15 points
}
/**
 * Get human-readable score interpretation
 */
function interpretScore(score) {
    if (score >= 85) {
        return {
            label: 'Highly Credible',
            description: 'Strong evidence supports the credibility of this content',
            color: 'green'
        };
    }
    else if (score >= 70) {
        return {
            label: 'Likely Credible',
            description: 'Good indicators of credibility with minor concerns',
            color: 'lightgreen'
        };
    }
    else if (score >= 55) {
        return {
            label: 'Uncertain',
            description: 'Mixed signals - verify independently before sharing',
            color: 'yellow'
        };
    }
    else if (score >= 40) {
        return {
            label: 'Questionable',
            description: 'Multiple red flags present - treat with skepticism',
            color: 'orange'
        };
    }
    else {
        return {
            label: 'Not Credible',
            description: 'Strong indicators of misinformation or unreliable content',
            color: 'red'
        };
    }
}
/**
 * Calculate confidence in the score
 * (How confident are we in our assessment?)
 */
function calculateConfidenceLevel(aiConfidence, sourceCount, hasSourceUrl) {
    let confidence = aiConfidence || 50;
    // More corroborating sources = higher confidence
    if (sourceCount >= 5)
        confidence += 15;
    else if (sourceCount >= 3)
        confidence += 10;
    else if (sourceCount >= 1)
        confidence += 5;
    // Having a verifiable source URL increases confidence
    if (hasSourceUrl)
        confidence += 10;
    else
        confidence -= 15;
    return Math.min(100, Math.max(0, Math.round(confidence)));
}
