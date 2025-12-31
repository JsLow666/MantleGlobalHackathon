// src/ai/prompts.ts

interface NewsSource {
  name: string;
  url: string;
  snippet?: string;
  relevant: boolean;
}

/**
 * Generate comprehensive fact-checking prompt
 */
export function getFactCheckPrompt(
  content: string,
  sourceUrl: string,
  title?: string,
  relatedSources?: NewsSource[]
): string {
  const sourcesContext = relatedSources && relatedSources.length > 0
    ? `\n\nRelated news from trusted sources:\n${relatedSources.map((s, i) => 
        `${i + 1}. ${s.name}: ${s.snippet || 'No snippet available'} (${s.url})`
      ).join('\n')}`
    : '';

  return `
Analyze the following news article for credibility and potential misinformation:

TITLE: ${title || 'No title provided'}
SOURCE: ${sourceUrl}

CONTENT:
${content}
${sourcesContext}

Please analyze this content thoroughly and provide your assessment in the following JSON format:

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
}

Consider the following in your analysis:
1. **Source credibility**: Is the source known and reputable?
2. **Evidence**: Are claims supported by evidence or sources?
3. **Language**: Is the language sensational, emotional, or clickbait-y?
4. **Verifiability**: Can the main claims be verified?
5. **Context**: Does the article provide proper context?
6. **Bias**: Is there obvious political or ideological bias?
7. **Corroboration**: Do other reputable sources report similar information?
8. **Author**: Is there author attribution and credentials?

Be objective and evidence-based in your assessment.
`.trim();
}

/**
 * Generate prompt for extracting specific claims
 */
export function getClaimExtractionPrompt(content: string): string {
  return `
Extract specific factual claims from the following news content. For each claim, assess its verifiability.

CONTENT:
${content}

Provide your response in the following JSON format:

{
  "claims": [
    {
      "claim": "Specific factual claim extracted from the text",
      "verdict": "true|false|unverifiable",
      "explanation": "Brief explanation of the verdict",
      "importance": "high|medium|low"
    }
  ]
}

Focus on:
- Statistical claims (numbers, percentages, dates)
- Attributions (quotes, statements by specific people/organizations)
- Causal claims (X caused Y)
- Factual assertions (events that happened)

Ignore opinions, predictions, or subjective statements.
`.trim();
}

/**
 * Generate prompt for source credibility assessment
 */
export function getSourceCredibilityPrompt(sourceUrl: string, sourceName?: string): string {
  return `
Assess the credibility of this news source:

SOURCE NAME: ${sourceName || 'Unknown'}
SOURCE URL: ${sourceUrl}

Provide your assessment in JSON format:

{
  "credibility_score": 75,
  "type": "mainstream_media|independent_media|blog|social_media|government|academic|unknown",
  "known_biases": ["list", "of", "biases"],
  "reliability_notes": "Brief assessment of source reliability",
  "fact_check_history": "Notes about past accuracy if known"
}

Consider:
- Is this a known news organization?
- What is their reputation for accuracy?
- Are they known for any particular bias?
- Have they been flagged for misinformation in the past?
`.trim();
}

/**
 * Generate prompt for detecting manipulation patterns
 */
export function getPatternDetectionPrompt(content: string): string {
  return `
Analyze the following text for common misinformation patterns:

CONTENT:
${content}

Return your assessment in JSON format:

{
  "sensationalism": true|false,
  "emotionalLanguage": true|false,
  "lackOfSources": true|false,
  "clickbait": true|false,
  "biasedLanguage": true|false,
  "logicalFallacies": ["list", "if", "found"],
  "manipulativeTactics": ["list", "if", "found"],
  "notes": "Brief explanation of detected patterns"
}

Look for:
- ALL CAPS, excessive exclamation marks, hyperbolic language
- Strong emotional appeals (fear, anger, outrage)
- Lack of source citations or vague attributions
- Clickbait headlines that don't match content
- One-sided presentation without counterpoints
- Ad hominem attacks or strawman arguments
`.trim();
}

/**
 * Generate summary prompt for quick analysis
 */
export function getQuickSummaryPrompt(content: string): string {
  return `
Provide a quick credibility assessment of this news content:

${content.substring(0, 1000)}

Rate the credibility from 0-100 and explain in 1-2 sentences why.

Format: 
Score: [0-100]
Reason: [explanation]
`.trim();
}