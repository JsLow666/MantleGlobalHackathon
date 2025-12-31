// src/utils/scoreCalculation.ts
export interface VoteCounts {
  real: number;
  fake: number;
  uncertain: number;
  total: number;
}

export interface DynamicScoreResult {
  aiScore: number;
  dynamicScore: number;
  communityScore: number;
  confidence: 'low' | 'medium' | 'high';
  voteWeight: number;
  aiWeight: number;
}

export enum Verdict {
  Pending = 0,
  Real = 1,
  Fake = 2,
  Uncertain = 3,
}

export interface ConsensusResult {
  verdict: Verdict;
  finalScore: number;
  confidence: number;
  isFinalized: boolean;
}

/**
 * Calculate dynamic score combining AI score with community votes
 * @param aiScore Original AI credibility score (0-100)
 * @param voteCounts Community vote counts
 * @returns Dynamic score calculation result
 */
export function calculateDynamicScore(aiScore: number, voteCounts: VoteCounts): DynamicScoreResult {
  const { real, uncertain, total } = voteCounts;

  // If no votes, return original AI score
  if (total === 0) {
    return {
      aiScore,
      dynamicScore: aiScore,
      communityScore: 0,
      confidence: 'low',
      voteWeight: 0,
      aiWeight: 1
    };
  }

  // Calculate community score based on vote distribution
  // Real = 100 points, Uncertain = 50 points, Fake = 0 points
  const communityScore = total > 0 ? (real * 100 + uncertain * 50) / total : 0;

  // Dynamic weighting based on vote count
  // AI weight decreases as more votes come in, community weight increases
  const aiWeight = Math.max(0.2, 1 - Math.min(total / 50, 0.8)); // AI weight: 100% → 20% as votes increase
  const voteWeight = 1 - aiWeight;

  // Calculate final dynamic score
  const dynamicScore = Math.round(aiScore * aiWeight + communityScore * voteWeight);

  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (total >= 10) {
    confidence = 'high';
  } else if (total >= 3) {
    confidence = 'medium';
  }

  return {
    aiScore,
    dynamicScore,
    communityScore: Math.round(communityScore),
    confidence,
    voteWeight,
    aiWeight
  };
}

/**
 * Calculate consensus verdict from AI score and community votes
 * @param aiScore AI credibility score (0-100)
 * @param voteCounts Community vote counts
 * @returns Consensus result with verdict and metadata
 */
export function calculateConsensus(aiScore: number, voteCounts: VoteCounts): ConsensusResult {
  const { total } = voteCounts;

  // If no AI score and no votes, verdict is Pending
  if (aiScore === 0 && total === 0) {
    return {
      verdict: Verdict.Pending,
      finalScore: 0,
      confidence: 0,
      isFinalized: false
    };
  }

  // Calculate community score
  const communityScore = total > 0 ? (voteCounts.real * 100 + voteCounts.uncertain * 50) / total : 0;

  // Calculate final weighted score (40% AI, 60% community)
  const aiWeight = 0.4;
  const communityWeight = 0.6;
  const finalScore = Math.round(aiScore * aiWeight + communityScore * communityWeight);

  // Determine verdict based on final score
  let verdict: Verdict;
  if (finalScore >= 65) {
    verdict = Verdict.Real;
  } else if (finalScore <= 35) {
    verdict = Verdict.Fake;
  } else {
    verdict = Verdict.Uncertain;
  }

  // Calculate confidence (0-100)
  let confidence = 0;

  // Vote count factor (0-40 points)
  const voteConfidence = total >= 20 ? 40 : (total * 40) / 20;
  confidence += voteConfidence;

  // Score clarity factor (0-30 points) - how far from 50 the score is
  const clarity = finalScore > 50 ? finalScore - 50 : 50 - finalScore;
  const clarityConfidence = (clarity * 30) / 50;
  confidence += clarityConfidence;

  // AI-community agreement factor (0-30 points)
  if (aiScore > 0 && total > 0) {
    const agreement = Math.abs(aiScore - communityScore) <= 20 ? 30 : 0;
    confidence += agreement;
  } else if (aiScore > 0) {
    confidence += 15; // Partial confidence with only AI
  } else if (total > 0) {
    confidence += 15; // Partial confidence with only community
  }

  confidence = Math.min(confidence, 100);

  // Check if should be finalized (minimum votes required)
  const minVotesRequired = 5;
  const isFinalized = (total >= minVotesRequired && aiScore > 0);

  return {
    verdict,
    finalScore,
    confidence: Math.round(confidence),
    isFinalized
  };
}

/**
 * Get confidence color for UI display
 */
export function getConfidenceColor(confidence: 'low' | 'medium' | 'high'): string {
  switch (confidence) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get confidence label for UI display
 */
export function getConfidenceLabel(confidence: 'low' | 'medium' | 'high'): string {
  switch (confidence) {
    case 'high': return 'High Confidence';
    case 'medium': return 'Medium Confidence';
    case 'low': return 'Low Confidence';
    default: return 'Unknown';
  }
}