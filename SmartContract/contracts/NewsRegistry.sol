// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ZKVerifier.sol";

/**
 * @title NewsRegistry
 * @notice Manages news submissions with AI analysis included upfront
 * @dev Users submit news directly with AI score from backend
 */
contract NewsRegistry {
    
    // ============ Structs ============
    
    struct News {
        uint256 id;
        bytes32 contentHash;        // Hash of news content (text + link)
        uint256 aiScore;            // AI credibility score (0-100)
        address submitter;
        bytes32 submitterZkHash;    // ZK identity of submitter
        uint256 timestamp;
        string title;               // Short title for display
        string sourceUrl;           // Original news URL
        bool exists;
    }
    
    // ============ Events ============
    
    event NewsSubmitted(
        uint256 indexed newsId,
        bytes32 indexed contentHash,
        address indexed submitter,
        bytes32 submitterZkHash,
        uint256 aiScore,
        uint256 timestamp
    );
    
    // ============ State Variables ============
    
    /// @notice Counter for news IDs
    uint256 public newsCount;
    
    /// @notice Mapping of news ID to News struct
    mapping(uint256 => News) public newsById;
    
    /// @notice Mapping of content hash to news ID (prevent duplicates)
    mapping(bytes32 => uint256) public contentHashToNewsId;
    
    /// @notice Array of all news IDs for enumeration
    uint256[] public allNewsIds;
    
    /// @notice Reference to ZKVerifier contract
    ZKVerifier public zkVerifier;
    
    /// @notice Owner address
    address public owner;
    
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
    
    // ============ Constructor ============
    
    constructor(address _zkVerifier) {
        require(_zkVerifier != address(0), "Invalid ZKVerifier address");
        
        zkVerifier = ZKVerifier(_zkVerifier);
        owner = msg.sender;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Submits news with AI analysis (user pays gas)
     * @param contentHash Hash of the news content
     * @param title Short title of the news
     * @param sourceUrl URL of the original news source
     * @param aiScore AI credibility score (0-100) from backend analysis
     * @return newsId The ID of the newly created news entry
     */
    function submitNews(
        bytes32 contentHash,
        string calldata title,
        string calldata sourceUrl,
        uint256 aiScore
    ) external onlyVerifiedUser returns (uint256) {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(bytes(title).length > 0 && bytes(title).length <= 200, "Invalid title length");
        require(bytes(sourceUrl).length > 0 && bytes(sourceUrl).length <= 500, "Invalid URL length");
        require(aiScore <= 100, "Score must be 0-100");
        require(contentHashToNewsId[contentHash] == 0, "News already submitted");
        
        bytes32 submitterZkHash = zkVerifier.getZkHash(msg.sender);
        
        newsCount++;
        uint256 newNewsId = newsCount;
        
        newsById[newNewsId] = News({
            id: newNewsId,
            contentHash: contentHash,
            aiScore: aiScore,
            submitter: msg.sender,
            submitterZkHash: submitterZkHash,
            timestamp: block.timestamp,
            title: title,
            sourceUrl: sourceUrl,
            exists: true
        });
        
        contentHashToNewsId[contentHash] = newNewsId;
        allNewsIds.push(newNewsId);
        
        emit NewsSubmitted(
            newNewsId,
            contentHash,
            msg.sender,
            submitterZkHash,
            aiScore,
            block.timestamp
        );
        
        return newNewsId;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Gets news details by ID
     * @param newsId The ID of the news entry
     * @return News struct
     */
    function getNews(uint256 newsId) external view returns (News memory) {
        require(newsById[newsId].exists, "News does not exist");
        return newsById[newsId];
    }
    
    /**
     * @notice Gets the total number of news submissions
     * @return uint256 Total count
     */
    function getTotalNews() external view returns (uint256) {
        return newsCount;
    }
    
    /**
     * @notice Gets a paginated list of news IDs
     * @param offset Starting index
     * @param limit Number of items to return
     * @return uint256[] Array of news IDs
     */
    function getNewsList(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        require(offset < allNewsIds.length || allNewsIds.length == 0, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > allNewsIds.length) {
            end = allNewsIds.length;
        }
        
        uint256 resultLength = end - offset;
        uint256[] memory result = new uint256[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = allNewsIds[offset + i];
        }
        
        return result;
    }
    
    /**
     * @notice Gets the latest news IDs
     * @param count Number of latest news to return
     * @return uint256[] Array of news IDs
     */
    function getLatestNews(uint256 count) external view returns (uint256[] memory) {
        if (count > allNewsIds.length) {
            count = allNewsIds.length;
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 startIndex = allNewsIds.length - count;
        
        for (uint256 i = 0; i < count; i++) {
            result[i] = allNewsIds[startIndex + i];
        }
        
        return result;
    }
    
    /**
     * @notice Gets AI score for a news item
     * @param newsId The ID of the news entry
     * @return uint256 AI credibility score
     */
    function getAIScore(uint256 newsId) external view returns (uint256) {
        require(newsById[newsId].exists, "News does not exist");
        return newsById[newsId].aiScore;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Transfers ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}