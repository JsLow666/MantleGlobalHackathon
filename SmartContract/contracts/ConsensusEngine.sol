// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./NewsRegistry.sol";
import "./VoteManager.sol";

/**
 * @title ConsensusEngine
 * @notice Combines AI analysis with community voting to determine news credibility
 * @dev AI score comes from NewsRegistry, no separate oracle needed
 */
contract ConsensusEngine {
    
    // ============ Enums ============
    
    enum Verdict {
        Pending,        // 0 - Not enough data yet
        Real,           // 1 - Determined to be real
        Fake,           // 2 - Determined to be fake
        Uncertain,      // 3 - Conflicting signals
        Disputed        // 4 - High disagreement
    }
    
    // ============ Structs ============
    
    struct ConsensusResult {
        uint256 newsId;
        Verdict verdict;
        uint256 aiScore;            // AI credibility score (0-100)
        uint256 communityScore;     // Community credibility score (0-100)
        uint256 finalScore;         // Weighted final score (0-100)
        uint256 confidence;         // Confidence level (0-100)
        uint256 timestamp;
        bool finalized;
    }
    
    // ============ Events ============
    
    event VerdictCalculated(
        uint256 indexed newsId,
        Verdict verdict,
        uint256 finalScore,
        uint256 confidence,
        uint256 timestamp
    );
    
    event VerdictFinalized(
        uint256 indexed newsId,
        Verdict verdict,
        uint256 timestamp
    );
    
    // ============ State Variables ============
    
    /// @notice Mapping of newsId to ConsensusResult
    mapping(uint256 => ConsensusResult) public results;
    
    /// @notice Reference to NewsRegistry contract
    NewsRegistry public newsRegistry;
    
    /// @notice Reference to VoteManager contract
    VoteManager public voteManager;
    
    /// @notice Owner address
    address public owner;
    
    // ============ Configuration Parameters ============
    
    /// @notice Weight of AI score in final calculation (0-100, where 100 = 100%)
    uint256 public aiWeight = 40; // 40% AI, 60% community
    
    /// @notice Minimum votes required for finalization
    uint256 public minVotesRequired = 5;
    
    /// @notice Threshold for "Real" verdict (0-100)
    uint256 public realThreshold = 65;
    
    /// @notice Threshold for "Fake" verdict (0-100)
    uint256 public fakeThreshold = 35;
    
    /// @notice Threshold for high disagreement (disputed)
    uint256 public disputeThreshold = 45; // If all vote types are close
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(
        address _newsRegistry,
        address _voteManager
    ) {
        require(_newsRegistry != address(0), "Invalid NewsRegistry address");
        require(_voteManager != address(0), "Invalid VoteManager address");
        
        newsRegistry = NewsRegistry(_newsRegistry);
        voteManager = VoteManager(_voteManager);
        owner = msg.sender;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Calculates verdict based on AI and community votes
     * @param newsId The ID of the news item
     * @dev Can be called by anyone to update the verdict
     */
    function calculateVerdict(uint256 newsId) external {
        (, , , , , , , , bool exists) = newsRegistry.newsById(newsId);
        require(exists, "News does not exist");
        _calculateVerdict(newsId);
    }
    
    /**
     * @notice Internal function to calculate verdict
     */
    function _calculateVerdict(uint256 newsId) internal {
        VoteManager.VoteCounts memory votes = voteManager.getVoteCounts(newsId);
        
        // Get AI score from NewsRegistry
        uint256 aiScore = newsRegistry.getAIScore(newsId);
        
        // If no AI score and no votes, verdict is Pending
        if (aiScore == 0 && votes.total == 0) {
            results[newsId] = ConsensusResult({
                newsId: newsId,
                verdict: Verdict.Pending,
                aiScore: 0,
                communityScore: 0,
                finalScore: 0,
                confidence: 0,
                timestamp: block.timestamp,
                finalized: false
            });
            return;
        }
        
        // Calculate community score
        uint256 communityScore = _calculateCommunityScore(votes);
        
        // Calculate final weighted score
        uint256 finalScore;
        if (aiScore > 0 && votes.total > 0) {
            // Both AI and community votes available
            finalScore = (aiScore * aiWeight + communityScore * (100 - aiWeight)) / 100;
        } else if (aiScore > 0) {
            // Only AI score available
            finalScore = aiScore;
        } else {
            // Only community votes available
            finalScore = communityScore;
        }
        
        // Determine verdict
        Verdict verdict = _determineVerdict(finalScore, votes);
        
        // Calculate confidence
        uint256 confidence = _calculateConfidence(aiScore, votes, finalScore);
        
        // Check if should be finalized
        bool finalized = (votes.total >= minVotesRequired && aiScore > 0);
        
        results[newsId] = ConsensusResult({
            newsId: newsId,
            verdict: verdict,
            aiScore: aiScore,
            communityScore: communityScore,
            finalScore: finalScore,
            confidence: confidence,
            timestamp: block.timestamp,
            finalized: finalized
        });
        
        emit VerdictCalculated(newsId, verdict, finalScore, confidence, block.timestamp);
        
        if (finalized) {
            emit VerdictFinalized(newsId, verdict, block.timestamp);
        }
    }
    
    /**
     * @notice Calculates community credibility score from votes
     */
    function _calculateCommunityScore(VoteManager.VoteCounts memory votes) 
        internal 
        pure 
        returns (uint256) 
    {
        if (votes.total == 0) return 0;
        
        // Real votes contribute positively, Fake votes negatively, Uncertain is neutral (50)
        // Score = (Real * 100 + Uncertain * 50 + Fake * 0) / total
        uint256 score = (votes.real * 100 + votes.uncertain * 50) / votes.total;
        
        return score;
    }
    
    /**
     * @notice Determines verdict based on final score and vote distribution
     */
    function _determineVerdict(uint256 finalScore, VoteManager.VoteCounts memory votes) 
        internal 
        view 
        returns (Verdict) 
    {
        // Not enough data
        if (votes.total < minVotesRequired && finalScore == 0) {
            return Verdict.Pending;
        }
        
        // Check for high disagreement (disputed)
        if (votes.total >= minVotesRequired) {
            uint256 realPercent = (votes.real * 100) / votes.total;
            uint256 fakePercent = (votes.fake * 100) / votes.total;
            uint256 uncertainPercent = (votes.uncertain * 100) / votes.total;
            
            // If all three categories are relatively close, mark as disputed
            if (realPercent <= disputeThreshold && 
                fakePercent <= disputeThreshold && 
                uncertainPercent <= disputeThreshold) {
                return Verdict.Disputed;
            }
        }
        
        // Determine based on final score
        if (finalScore >= realThreshold) {
            return Verdict.Real;
        } else if (finalScore <= fakeThreshold) {
            return Verdict.Fake;
        } else {
            return Verdict.Uncertain;
        }
    }
    
    /**
     * @notice Calculates confidence level in the verdict
     */
    function _calculateConfidence(
        uint256 aiScore,
        VoteManager.VoteCounts memory votes,
        uint256 finalScore
    ) internal pure returns (uint256) {
        uint256 confidence = 0;
        
        // Vote count factor (0-40 points)
        uint256 voteConfidence = votes.total >= 20 ? 40 : (votes.total * 40) / 20;
        confidence += voteConfidence;
        
        // Score clarity factor (0-30 points)
        uint256 clarity = finalScore > 50 ? finalScore - 50 : 50 - finalScore;
        uint256 clarityConfidence = (clarity * 30) / 50;
        confidence += clarityConfidence;
        
        // AI-Community agreement factor (0-30 points)
        if (aiScore > 0 && votes.total > 0) {
            uint256 communityScore = _calculateCommunityScore(votes);
            uint256 diff = aiScore > communityScore ? 
                aiScore - communityScore : communityScore - aiScore;
            uint256 agreement = 100 - diff;
            uint256 agreementConfidence = (agreement * 30) / 100;
            confidence += agreementConfidence;
        } else {
            confidence += 15; // Partial credit if only one signal
        }
        
        return confidence > 100 ? 100 : confidence;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Gets consensus result for a news item
     * @param newsId The ID of the news item
     * @return ConsensusResult struct
     */
    function getResult(uint256 newsId) external view returns (ConsensusResult memory) {
        return results[newsId];
    }
    
    /**
     * @notice Gets verdict for a news item
     * @param newsId The ID of the news item
     * @return Verdict enum
     */
    function getVerdict(uint256 newsId) external view returns (Verdict) {
        return results[newsId].verdict;
    }
    
    /**
     * @notice Checks if verdict is finalized
     * @param newsId The ID of the news item
     * @return bool Whether the verdict is finalized
     */
    function isFinalized(uint256 newsId) external view returns (bool) {
        return results[newsId].finalized;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Updates AI weight in consensus calculation
     * @param newWeight New AI weight (0-100)
     */
    function setAIWeight(uint256 newWeight) external onlyOwner {
        require(newWeight <= 100, "Weight must be 0-100");
        aiWeight = newWeight;
    }
    
    /**
     * @notice Updates minimum votes required
     * @param newMin New minimum vote count
     */
    function setMinVotesRequired(uint256 newMin) external onlyOwner {
        require(newMin > 0, "Must require at least 1 vote");
        minVotesRequired = newMin;
    }
    
    /**
     * @notice Updates verdict thresholds
     * @param _realThreshold Threshold for Real verdict
     * @param _fakeThreshold Threshold for Fake verdict
     */
    function setThresholds(uint256 _realThreshold, uint256 _fakeThreshold) external onlyOwner {
        require(_realThreshold > _fakeThreshold, "Real threshold must be > Fake threshold");
        require(_realThreshold <= 100 && _fakeThreshold <= 100, "Thresholds must be 0-100");
        realThreshold = _realThreshold;
        fakeThreshold = _fakeThreshold;
    }
    
    /**
     * @notice Transfers ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}