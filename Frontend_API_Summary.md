# Frontend API Summary

This document summarizes the backend APIs and smart contract functions that the frontend needs to call for the ProofFeed application.

## Backend APIs (Express.js Server)

### 1. AI Analysis APIs

#### POST `/api/analyze`
**Purpose**: Get comprehensive AI analysis for news content using Google Gemini AI.

**Input**:
```json
{
  "content": "string (news content to analyze)",
  "title": "string (news title)",
  "sourceUrl": "string (original news URL)"
}
```

**Output**:
```json
{
  "success": true,
  "analysis": {
    "score": "number (0-100 AI credibility score)",
    "verdict": "string (Real/Fake/Uncertain)",
    "explanation": "string (detailed explanation)",
    "reasoning": "string (AI reasoning)",
    "confidence": "number (0-100)",
    "flags": "array (any red flags detected)",
    "sources": "array (sources checked)"
  },
  "blockchain": {
    "contentHash": "bytes32 (hash for blockchain submission)",
    "instructions": {
      "contract": "NewsRegistry",
      "function": "submitNews",
      "parameters": {
        "contentHash": "bytes32",
        "title": "string",
        "sourceUrl": "string",
        "aiScore": "number"
      }
    }
  },
  "timestamp": "string (ISO timestamp)"
}
```

#### POST `/api/analyze/quick`
**Purpose**: Quick credibility check (lighter analysis).

**Input**:
```json
{
  "content": "string (minimum 50 characters)"
}
```

**Output**:
```json
{
  "success": true,
  "score": "number (0-100)",
  "note": "string (explanation)"
}
```

#### POST `/api/analyze/batch`
**Purpose**: Analyze multiple news items in batch.

**Input**:
```json
{
  "items": [
    {
      "content": "string",
      "title": "string",
      "sourceUrl": "string"
    }
  ]
}
```

**Output**:
```json
{
  "success": true,
  "results": [
    {
      "success": "boolean",
      "data": "object (analysis data)",
      "error": "string (if failed)"
    }
  ],
  "count": "number"
}
```

### 2. Health Check API

#### GET `/api/health`
**Purpose**: Check system health and configuration.

**Input**: None

**Output**:
```json
{
  "status": "healthy/unhealthy",
  "timestamp": "string",
  "uptime": "number",
  "responseTime": "string",
  "environment": "string",
  "services": {
    "ai": "Google Gemini",
    "aiStatus": true,
    "rpc": true,
    "contracts": true
  },
  "architecture": {
    "role": "AI Analysis Service Only",
    "aiProvider": "Google Gemini 1.5 Flash",
    "gasCost": "ZERO",
    "flow": "Backend (Gemini AI) → Frontend → Blockchain"
  }
}
```

## Smart Contract Functions

### 1. User Registration (ZKVerifier Contract)

#### `verifyAndRegister(bytes32 zkHash, bytes calldata proof)`
**Purpose**: Register user with zero-knowledge proof for Sybil resistance.

**Input**:
- `zkHash`: `bytes32` - Zero-knowledge identity hash
- `proof`: `bytes` - ZK proof data (simplified for MVP)

**Output**:
- Returns: `uint256` (news ID)

**Requirements**: User must not be already verified, address must not have identity.

#### `isVerified(bytes32 zkHash)`
**Purpose**: Check if a ZK identity is verified.

**Input**:
- `zkHash`: `bytes32` - ZK identity hash

**Output**:
- Returns: `bool` - Verification status

#### `getZkHash(address userAddress)`
**Purpose**: Get ZK hash for an address.

**Input**:
- `userAddress`: `address` - User address

**Output**:
- Returns: `bytes32` - ZK identity hash

### 2. News Management (NewsRegistry Contract)

#### `submitNews(bytes32 contentHash, string title, string sourceUrl, uint256 aiScore)`
**Purpose**: Submit news with AI analysis score.

**Input**:
- `contentHash`: `bytes32` - Hash of news content
- `title`: `string` - News title (1-200 chars)
- `sourceUrl`: `string` - Source URL (1-500 chars)
- `aiScore`: `uint256` - AI credibility score (0-100)

**Output**:
- Returns: `uint256` - News ID

**Requirements**: User must be verified, news must not exist.

#### `getNews(uint256 newsId)`
**Purpose**: Get complete news details.

**Input**:
- `newsId`: `uint256` - News ID

**Output**:
```solidity
struct News {
  uint256 id;
  bytes32 contentHash;
  uint256 aiScore;
  address submitter;
  bytes32 submitterZkHash;
  uint256 timestamp;
  string title;
  string sourceUrl;
  bool exists;
}
```

#### `getNewsList(uint256 offset, uint256 limit)`
**Purpose**: Get paginated list of news IDs.

**Input**:
- `offset`: `uint256` - Starting index
- `limit`: `uint256` - Number of items

**Output**:
- Returns: `uint256[]` - Array of news IDs

#### `getLatestNews(uint256 count)`
**Purpose**: Get latest news IDs.

**Input**:
- `count`: `uint256` - Number of latest news

**Output**:
- Returns: `uint256[]` - Array of news IDs

#### `getTotalNews()`
**Purpose**: Get total number of news submissions.

**Input**: None

**Output**:
- Returns: `uint256` - Total count

### 3. Voting System (VoteManager Contract)

#### `castVote(uint256 newsId, VoteType voteType)`
**Purpose**: Cast or change vote on news credibility.

**Input**:
- `newsId`: `uint256` - News ID
- `voteType`: `uint8` - Vote type (1=Real, 2=Fake, 3=Uncertain)

**Output**: None (emits event)

**Requirements**: User must be verified, news must exist.

#### `getVoteCounts(uint256 newsId)`
**Purpose**: Get vote counts for news.

**Input**:
- `newsId`: `uint256` - News ID

**Output**:
```solidity
struct VoteCounts {
  uint256 real;
  uint256 fake;
  uint256 uncertain;
  uint256 total;
}
```

#### `getMyVote(uint256 newsId)`
**Purpose**: Get current user's vote on news.

**Input**:
- `newsId`: `uint256` - News ID

**Output**:
- Returns: `VoteType` - User's vote (0=None, 1=Real, 2=Fake, 3=Uncertain)

#### `haveIVoted(uint256 newsId)`
**Purpose**: Check if current user has voted on news.

**Input**:
- `newsId`: `uint256` - News ID

**Output**:
- Returns: `bool` - Whether user has voted

## Frontend Integration Flow

### 1. User Registration Flow
1. User provides ZK proof (frontend generates or user provides)
2. Call `ZKVerifier.verifyAndRegister(zkHash, proof)`
3. Check verification with `ZKVerifier.isVerified(zkHash)`

### 2. News Submission Flow
1. User inputs news content, title, URL
2. Call `POST /api/analyze` with content data
3. Receive AI score and content hash
4. Call `NewsRegistry.submitNews(contentHash, title, sourceUrl, aiScore)`
5. News is submitted to blockchain

### 3. News Viewing Flow
1. Call `NewsRegistry.getTotalNews()` to get count
2. Call `NewsRegistry.getNewsList(offset, limit)` for pagination
3. For each news ID, call `NewsRegistry.getNews(newsId)` for details
4. Consensus is calculated client-side using AI score and vote counts

### 4. Voting Flow
1. Check if user voted: `VoteManager.haveIVoted(newsId)`
2. If not voted, call `VoteManager.castVote(newsId, voteType)`
3. Get vote counts: `VoteManager.getVoteCounts(newsId)`
4. Consensus is automatically recalculated client-side after each vote

## Contract Addresses (Mantle Sepolia Testnet)
- ZKVerifier: `0x99b690CffeE0B2Fc4fA7c7c6377fA894acc1170f`
- NewsRegistry: `0x844e20a6dB15Acf7EeF25fcB7a131D5De3Ff5328`
- VoteManager: `0x0a032A4de0A549b4957A8077dd886339ff721fd9`

## Notes
- Backend handles AI analysis only (no gas costs)
- Users pay gas for blockchain submissions
- Consensus is calculated client-side using AI score and community votes
- All blockchain functions require verified users (ZK proof)
- Vote changes are allowed by default
- Consensus combines AI (40%) and community (60%) scores</content>
<parameter name="filePath">c:\Users\user\Documents\Hackathon\MantleGlobalHackathon\Frontend_API_Summary.md