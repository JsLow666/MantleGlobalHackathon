// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ZKVerifier.sol";
import "./NewsRegistry.sol";

/**
 * @title VoteManager
 * @notice Manages community voting on news credibility
 * @dev Enforces one vote per ZK identity per news item
 */
contract VoteManager {
    
    // ============ Enums ============
    
    enum VoteType {
        None,       // 0 - No vote cast
        Real,       // 1 - News is real/credible
        Fake,       // 2 - News is fake/not credible
        Uncertain   // 3 - Uncertain/need more info
    }
    
    // ============ Structs ============
    
    struct VoteCounts {
        uint256 real;
        uint256 fake;
        uint256 uncertain;
        uint256 total;
    }
    
    // ============ Events ============
    
    event VoteCast(
        uint256 indexed newsId,
        bytes32 indexed voterZkHash,
        VoteType voteType,
        uint256 timestamp
    );
    
    event VoteChanged(
        uint256 indexed newsId,
        bytes32 indexed voterZkHash,
        VoteType oldVote,
        VoteType newVote,
        uint256 timestamp
    );
    
    // ============ State Variables ============
    
    /// @notice Mapping of newsId => voterZkHash => VoteType
    mapping(uint256 => mapping(bytes32 => VoteType)) public votes;
    
    /// @notice Mapping of newsId => VoteCounts
    mapping(uint256 => VoteCounts) public voteCounts;
    
    /// @notice Reference to ZKVerifier contract
    ZKVerifier public zkVerifier;
    
    /// @notice Reference to NewsRegistry contract
    NewsRegistry public newsRegistry;
    
    /// @notice Owner address
    address public owner;
    
    /// @notice Allow vote changes (for MVP can be true)
    bool public allowVoteChanges;
    
    // ============ Modifiers ============
    
    modifier onlyVerifiedUser() {
        bytes32 zkHash = zkVerifier.getZkHash(msg.sender);
        require(zkHash != bytes32(0), "User not verified");
        require(zkVerifier.isVerified(zkHash), "User verification invalid");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }
    
    modifier validVoteType(VoteType voteType) {
        require(
            voteType == VoteType.Real || 
            voteType == VoteType.Fake || 
            voteType == VoteType.Uncertain,
            "Invalid vote type"
        );
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _zkVerifier, address _newsRegistry) {
        require(_zkVerifier != address(0), "Invalid ZKVerifier address");
        require(_newsRegistry != address(0), "Invalid NewsRegistry address");
        
        zkVerifier = ZKVerifier(_zkVerifier);
        newsRegistry = NewsRegistry(_newsRegistry);
        owner = msg.sender;
        allowVoteChanges = true; // Allow for MVP
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Casts a vote on a news item
     * @param newsId The ID of the news item
     * @param voteType The type of vote (Real, Fake, Uncertain)
     */
    function castVote(uint256 newsId, VoteType voteType) 
        external 
        onlyVerifiedUser 
        validVoteType(voteType) 
    {
        // Verify news exists
        (, , , , , , , , bool exists) = newsRegistry.newsById(newsId);
        require(exists, "News does not exist");

        
        bytes32 voterZkHash = zkVerifier.getZkHash(msg.sender);
        VoteType existingVote = votes[newsId][voterZkHash];
        
        // Check if already voted
        if (existingVote != VoteType.None) {
            require(allowVoteChanges, "Vote changes not allowed");
            _changeVote(newsId, voterZkHash, existingVote, voteType);
        } else {
            _newVote(newsId, voterZkHash, voteType);
        }
    }
    
    /**
     * @notice Internal function to record a new vote
     */
    function _newVote(uint256 newsId, bytes32 voterZkHash, VoteType voteType) internal {
        votes[newsId][voterZkHash] = voteType;
        
        // Update vote counts
        if (voteType == VoteType.Real) {
            voteCounts[newsId].real++;
        } else if (voteType == VoteType.Fake) {
            voteCounts[newsId].fake++;
        } else if (voteType == VoteType.Uncertain) {
            voteCounts[newsId].uncertain++;
        }
        voteCounts[newsId].total++;
        
        emit VoteCast(newsId, voterZkHash, voteType, block.timestamp);
    }
    
    /**
     * @notice Internal function to change an existing vote
     */
    function _changeVote(
        uint256 newsId, 
        bytes32 voterZkHash, 
        VoteType oldVote, 
        VoteType newVote
    ) internal {
        // Don't allow voting the same thing
        require(oldVote != newVote, "Same vote type");
        
        // Decrement old vote count
        if (oldVote == VoteType.Real) {
            voteCounts[newsId].real--;
        } else if (oldVote == VoteType.Fake) {
            voteCounts[newsId].fake--;
        } else if (oldVote == VoteType.Uncertain) {
            voteCounts[newsId].uncertain--;
        }
        
        // Increment new vote count
        if (newVote == VoteType.Real) {
            voteCounts[newsId].real++;
        } else if (newVote == VoteType.Fake) {
            voteCounts[newsId].fake++;
        } else if (newVote == VoteType.Uncertain) {
            voteCounts[newsId].uncertain++;
        }
        
        // Update vote
        votes[newsId][voterZkHash] = newVote;
        
        emit VoteChanged(newsId, voterZkHash, oldVote, newVote, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Gets a user's vote on a news item
     * @param newsId The ID of the news item
     * @param voterZkHash The ZK hash of the voter
     * @return VoteType The vote type
     */
    function getVote(uint256 newsId, bytes32 voterZkHash) external view returns (VoteType) {
        return votes[newsId][voterZkHash];
    }
    
    /**
     * @notice Gets a user's own vote on a news item
     * @param newsId The ID of the news item
     * @return VoteType The vote type
     */
    function getMyVote(uint256 newsId) external view returns (VoteType) {
        bytes32 myZkHash = zkVerifier.getZkHash(msg.sender);
        require(myZkHash != bytes32(0), "User not verified");
        return votes[newsId][myZkHash];
    }
    
    /**
     * @notice Gets vote counts for a news item
     * @param newsId The ID of the news item
     * @return VoteCounts struct
     */
    function getVoteCounts(uint256 newsId) external view returns (VoteCounts memory) {
        return voteCounts[newsId];
    }
    
    /**
     * @notice Gets vote percentages for a news item
     * @param newsId The ID of the news item
     * @return realPercent Percentage of Real votes (0-10000, where 10000 = 100%)
     * @return fakePercent Percentage of Fake votes
     * @return uncertainPercent Percentage of Uncertain votes
     */
    function getVotePercentages(uint256 newsId) external view returns (
        uint256 realPercent,
        uint256 fakePercent,
        uint256 uncertainPercent
    ) {
        VoteCounts memory counts = voteCounts[newsId];
        
        if (counts.total == 0) {
            return (0, 0, 0);
        }
        
        // Use basis points (1/100 of a percent) for precision
        realPercent = (counts.real * 10000) / counts.total;
        fakePercent = (counts.fake * 10000) / counts.total;
        uncertainPercent = (counts.uncertain * 10000) / counts.total;
        
        return (realPercent, fakePercent, uncertainPercent);
    }
    
    /**
     * @notice Checks if a user has voted on a news item
     * @param newsId The ID of the news item
     * @param voterZkHash The ZK hash of the voter
     * @return bool Whether the user has voted
     */
    function hasVoted(uint256 newsId, bytes32 voterZkHash) external view returns (bool) {
        return votes[newsId][voterZkHash] != VoteType.None;
    }
    
    /**
     * @notice Checks if the current user has voted on a news item
     * @param newsId The ID of the news item
     * @return bool Whether the user has voted
     */
    function haveIVoted(uint256 newsId) external view returns (bool) {
        bytes32 myZkHash = zkVerifier.getZkHash(msg.sender);
        if (myZkHash == bytes32(0)) return false;
        return votes[newsId][myZkHash] != VoteType.None;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Toggles whether vote changes are allowed
     * @param allow Whether to allow vote changes
     */
    function setAllowVoteChanges(bool allow) external onlyOwner {
        allowVoteChanges = allow;
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