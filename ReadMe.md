# 📰 ProofFeed  
### A ZK-Powered, AI-Assisted Decentralized News Validation Platform on Mantle

---

## 🧠 Overview

**ProofFeed** is a decentralized, privacy-preserving news validation platform that combines **AI-based fact analysis**, **community consensus**, and **zero-knowledge login** to fight misinformation in a transparent and trust-minimized way.

Instead of relying on a single authority or opaque AI decisions, ProofFeed uses:
- AI as an **oracle signal**
- Humans as the **final arbiter**
- Mantle Network as the **tamper-proof settlement layer**

Users can log in using Google or email via **ZK login**, upload news, vote on credibility, and view consensus results — all without revealing personal identity.

---

## 🚨 Problem Statement

Fake news spreads faster than verification.

Current systems suffer from:
- Centralized control and censorship risks
- Black-box AI fact-checkers
- Bot-driven manipulation and Sybil attacks
- Lack of transparency and auditability
- Privacy-invasive identity requirements

There is no open, verifiable, and privacy-preserving infrastructure for news credibility.

---

## 💡 Solution

**ProofFeed** introduces a decentralized credibility oracle for news content.

### Key Principles
- **AI assists, not decides**
- **Humans validate, not platforms**
- **Identity is proven, not revealed**
- **Results are transparent and immutable**

---

## 🔍 How It Works

### 1️⃣ ZK Login (Sybil Resistance)
Users authenticate via:
- Google
- Email

Using zero-knowledge login:
- Users prove they are unique humans
- No personal data is stored on-chain
- One-person-one-vote is enforced
- Reputation can be built without doxxing

---

### 2️⃣ News Submission
- Users submit:
  - News text
  - Article link
  - Media metadata (optional)
- A hash of the content is stored on-chain
- Full content is stored off-chain (IPFS / backend)

---

### 3️⃣ AI Fact Analysis (Oracle Signal)
An AI service analyzes the news:
- Cross-references trusted data sources
- Detects misinformation patterns
- Evaluates source credibility

AI outputs:
- **Credibility score (0–100)**
- **Confidence explanation**

⚠️ AI does **not** finalize truth — it provides probabilistic guidance.

---

### 4️⃣ Community Validation (On-Chain)
- Users vote:
  - ✅ Real
  - ❌ Fake
  - ⚠️ Uncertain
- Votes are:
  - Signed
  - Recorded on Mantle
  - Linked to ZK identity
- Consensus is computed from:
  - Community votes
  - AI signal weight

---

### 5️⃣ Final Verdict
The platform displays:
- AI credibility score
- Community vote distribution
- Final consensus outcome

Results are:
- Public
- Verifiable
- Immutable

---

## 🏗 Architecture


---

## 🪙 Why Mantle?

ProofFeed is built on **Mantle Network** because:

- **Low gas fees** enable frequent voting
- **High throughput** supports social interactions
- **EVM compatibility** simplifies development
- **Mantle DA** provides cost-efficient data availability
- Ideal for oracle-style and social consensus systems

Mantle serves as the **final settlement and trust layer** for news validation.

---

## 📦 Smart Contracts

### `NewsRegistry.sol`
- Registers news submissions
- Stores content hash
- Links AI analysis hash

### `VoteManager.sol`
- Records votes
- Enforces one vote per ZK identity
- Aggregates vote counts

### Consensus Calculation (Client-Side)
- **Removed ConsensusEngine contract** - consensus now calculated in frontend
- Combines AI score and community votes client-side
- Outputs final verdict based on weighted algorithm
- Real-time updates as votes are cast

### `ZKVerifier.sol`
- Verifies zero-knowledge login proofs
- Prevents Sybil attacks

---

## 🎯 Advanced Features (Phase 5)

### Analytics Dashboard
- **Platform Statistics**: Real-time metrics on news submissions, votes, and consensus
- **User Analytics**: Reputation tracking and community engagement metrics
- **Performance Insights**: System health and usage patterns

### Advanced Search & Filtering
- **Multi-criteria Search**: Filter by category, status, date range, and keywords
- **Sorting Options**: Sort by relevance, date, votes, or credibility score
- **Real-time Results**: Instant search with debounced input

### User Profiles & Reputation
- **Reputation System**: Earn points through accurate voting and contributions
- **Achievement Badges**: Unlock achievements for platform participation
- **Voting History**: Track personal voting accuracy and activity

### Performance Optimization
- **Lazy Loading**: Components loaded on-demand for faster initial load
- **Intelligent Caching**: Cache management for news data and user statistics
- **Memory Monitoring**: Real-time performance metrics and optimization tips

### Social Features
- **Article Interactions**: Like, bookmark, and share news articles
- **Community Sharing**: Share articles on social media platforms
- **Reporting System**: Flag inappropriate content for moderation

### Governance System
- **Proposal Creation**: Community members can create governance proposals
- **Democratic Voting**: Vote on platform changes and improvements
- **Transparent Process**: All proposals and votes recorded on-chain

---

## 🛠 Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for fast development and building
- TailwindCSS for responsive design
- ethers.js v6 for blockchain interaction
- MetaMask integration for wallet connectivity

**Backend**
- Node.js with TypeScript
- Express/Fastify for API endpoints
- AI analysis service (LLM-based)
- Oracle adapter for blockchain communication

**Blockchain**
- Solidity smart contracts
- Hardhat development environment
- Mantle Network testnet
- OpenZeppelin security libraries

**Performance & Optimization**
- Lazy loading and code splitting
- Intelligent caching system
- Debounced search and batch processing
- Memory usage monitoring

---

## 🎯 Hackathon Tracks Alignment

- ✅ **AI & Oracles**
- ✅ **ZK & Privacy**
- ✅ **GameFi & Social**
- ✅ **Infrastructure & Tooling**

---

## 📋 Implementation Status

### ✅ Completed Features
- **ZK Login Integration**: Google/email authentication with zero-knowledge proofs
- **News Submission System**: Full article submission with metadata
- **AI Fact Analysis**: Credibility scoring and confidence explanations
- **Community Voting**: Real-time voting with consensus computation
- **Real-time Updates**: Live event monitoring and notifications
- **Analytics Dashboard**: Comprehensive platform statistics
- **Advanced Search**: Multi-criteria filtering and sorting
- **User Profiles**: Reputation system with achievements
- **Performance Monitoring**: Real-time metrics and optimization
- **Social Features**: Like, share, bookmark, and report functionality
- **Governance System**: Proposal creation and community voting

### 🚧 Future Enhancements
- Token incentives for validators
- Advanced reputation weighting algorithms
- Multi-language AI analysis
- Cross-chain oracle integration
- Mobile application development

---

---

## 🧪 Deployment

1. Deploy smart contracts on Mantle Testnet
2. Start AI oracle backend
3. Run frontend application
4. Connect ZK login provider

Detailed deployment steps are provided in `/docs`.

---

## 📈 Future Roadmap

- Reputation-weighted voting
- Token incentives for validators
- API for media platforms
- DAO governance
- Cross-chain oracle feeds

---

## ⚖️ Compliance Disclaimer

ProofFeed does not claim absolute truth.
AI results are probabilistic.
Final outcomes represent community consensus signals.

---

## 👥 Team

- Smart Contract & Architecture
- Frontend & UX
- Backend & AI Oracle

---

## 🔗 Demo

- Demo Video: (link)
- Live Demo: (link)
- GitHub: (this repo)

---

## 🏁 Conclusion

ProofFeed creates a new trust layer for information by combining:
- AI intelligence
- Human judgment
- Zero-knowledge privacy
- On-chain transparency

Built on Mantle, it demonstrates how decentralized infrastructure can protect truth at scale.

---

## 🎉 Phase 5 Implementation Complete

**ProofFeed** has been successfully implemented with all advanced features for production readiness:

### ✅ Core Platform Features
- **Decentralized News Validation**: AI-assisted fact-checking with community consensus
- **ZK Identity Verification**: Privacy-preserving authentication without personal data storage
- **Real-time Blockchain Integration**: Live event monitoring and instant updates
- **Smart Contract Architecture**: Secure voting and consensus mechanisms

### ✅ Advanced User Experience
- **Analytics Dashboard**: Comprehensive platform metrics and user insights
- **Advanced Search**: Multi-criteria filtering with real-time results
- **User Profiles**: Reputation system with achievements and voting history
- **Performance Optimization**: Lazy loading, caching, and memory management
- **Social Features**: Like, share, bookmark, and report functionality
- **Governance System**: Community proposals and democratic decision-making

### ✅ Technical Excellence
- **Modern React Architecture**: TypeScript, hooks, and context-based state management
- **Performance Monitoring**: Real-time metrics with optimization recommendations
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Security Best Practices**: Input validation, error boundaries, and secure API calls

### 🚀 Production Ready Features
- Comprehensive error handling and user feedback
- Loading states and skeleton screens
- Accessibility considerations
- SEO-friendly routing and meta tags
- Bundle optimization and code splitting

The platform is now ready for deployment and real-world usage, providing a complete solution for decentralized news validation on the Mantle Network.

---


## 📁 Project Folder Structure

prooffeed/
├── README.md
│   └── Project overview, architecture, setup, and demo links

├── contracts/
│   ├── NewsRegistry.sol
│   │   └── Registers news submissions and stores content hashes
│   │      Tech: Solidity, Mantle EVM
│   │
│   ├── VoteManager.sol
│   │   └── Handles voting (Real / Fake / Uncertain)
│   │      Enforces one vote per ZK identity
│   │      Tech: Solidity, Mantle EVM
│   │
│   └── ZKVerifier.sol
│       └── Verifies zero-knowledge login proofs
│          Prevents Sybil attacks
│          Tech: Solidity, ZK libraries
│
├── frontend-utils/
│   └── scoreCalculation.ts
│       └── Client-side consensus calculation
│          Combines AI + community votes
│          Tech: TypeScript

├── scripts/
│   ├── deploy.ts
│   │   └── Deploys contracts to Mantle Testnet
│   │      Tech: TypeScript, Hardhat, Ethers.js
│   │
│   └── seed.ts
│       └── Optional script to seed test news posts
│          Tech: TypeScript, Hardhat

├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   │   └── Entry point for backend server
│   │   │      Tech: Node.js, TypeScript, Express/Fastify
│   │   │
│   │   ├── routes/
│   │   │   ├── analyze.ts
│   │   │   │   └── API endpoint for AI fact analysis
│   │   │   │      Tech: Express/Fastify
│   │   │   │
│   │   │   └── oracle.ts
│   │   │       └── Pushes AI analysis result to blockchain
│   │   │          Tech: Ethers.js, Mantle RPC
│   │   │
│   │   ├── ai/
│   │   │   ├── factChecker.ts
│   │   │   │   └── AI prompt & logic for fake news detection
│   │   │   │      Tech: LLM (OpenAI/Claude), NLP
│   │   │   │
│   │   │   └── sources.ts
│   │   │       └── Trusted data sources & reference links
│   │   │          Tech: External APIs / curated datasets
│   │   │
│   │   ├── zk/
│   │   │   └── verifyProof.ts
│   │   │       └── Verifies ZK login proofs off-chain
│   │   │          Tech: ZK SDK / JWT / cryptography
│   │   │
│   │   └── utils/
│   │       ├── ipfs.ts
│   │       │   └── Uploads news content to IPFS
│   │       │      Tech: IPFS, Web3.Storage
│   │       │
│   │       └── hash.ts
│   │           └── Generates content hashes
│   │              Tech: Crypto libraries
│   │
│   └── package.json
│       └── Backend dependencies

├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   │   └── Displays latest news & verdicts
│   │   │   │      Tech: React/Vue
│   │   │   │
│   │   │   ├── Submit.tsx
│   │   │   │   └── News submission UI
│   │   │   │      Tech: React/Vue
│   │   │   │
│   │   │   └── Detail.tsx
│   │   │       └── Shows AI analysis + voting interface
│   │   │          Tech: React/Vue
│   │   │
│   │   ├── components/
│   │   │   ├── VotePanel.tsx
│   │   │   │   └── Voting buttons & status display
│   │   │   │      Tech: React/Vue
│   │   │   │
│   │   │   └── VerdictBadge.tsx
│   │   │       └── Visual indicator of final result
│   │   │          Tech: React/Vue
│   │   │
│   │   ├── hooks/
│   │   │   ├── useZKLogin.ts
│   │   │   │   └── Handles Google/email ZK login
│   │   │   │      Tech: ZK SDK, OAuth
│   │   │   │
│   │   │   └── useContracts.ts
│   │   │       └── Reads/writes to Mantle smart contracts
│   │   │          Tech: Ethers.js / Wagmi
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   │   └── Communicates with backend API
│   │   │   │      Tech: Axios / Fetch
│   │   │   │
│   │   │   └── mantle.ts
│   │   │       └── Mantle RPC & contract config
│   │   │          Tech: Ethers.js
│   │   │
│   │   └── styles/
│   │       └── Global UI styles
│   │
│   └── package.json
│       └── Frontend dependencies

├── docs/
│   ├── architecture.md
│   │   └── System design & diagrams
│   │
│   ├── deployment.md
│   │   └── Step-by-step deployment guide
│   │
│   └── demo.md
│       └── Demo script & flow

└── .env.example
    └── Environment variables template
