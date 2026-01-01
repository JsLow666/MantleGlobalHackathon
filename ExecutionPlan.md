# ProofFeed Execution Plan

## 🎯 Project Goal
Build a ZK-powered, AI-assisted decentralized news validation platform on Mantle Network for the hackathon.

---

## 📅 Timeline Overview
**Total Duration:** 4-6 weeks (adjust based on hackathon deadline)

- **Phase 1:** Setup & Infrastructure (3-5 days)
- **Phase 2:** Smart Contracts (5-7 days)
- **Phase 3:** Backend & AI Oracle (5-7 days)
- **Phase 4:** Frontend Development (7-10 days)
- **Phase 5:** Integration & Testing (5-7 days)
- **Phase 6:** Deployment & Demo (2-3 days)

---

## Phase 1: Setup & Infrastructure (Days 1-5)

### 1.1 Project Initialization
- [ ] Create GitHub repository
- [ ] Set up project folder structure
- [ ] Initialize Git with .gitignore (node_modules, .env, artifacts/)
- [ ] Create README.md with project overview
- [ ] Set up project management board (GitHub Projects/Trello)

### 1.2 Development Environment
- [ ] Install Node.js (v18+), npm/yarn/pnpm
- [ ] Install Hardhat: `npm install --save-dev hardhat`
- [ ] Initialize Hardhat project: `npx hardhat init`
- [ ] Configure Hardhat for Mantle Testnet
- [ ] Install Solidity extensions (VS Code/IDE)
- [ ] Set up TypeScript configuration

### 1.3 Mantle Network Setup
- [ ] Create wallet (MetaMask/Rabby)
- [ ] Add Mantle Testnet to wallet
  - RPC: https://rpc.testnet.mantle.xyz
  - Chain ID: 5003
  - Currency: MNT
- [ ] Get testnet MNT from faucet
- [ ] Test transaction on Mantle Testnet
- [ ] Save RPC endpoints and explorer links

### 1.4 External Service Accounts
- [ ] Create OpenAI/Anthropic API account (for AI analysis)
- [ ] Set up IPFS account (Web3.Storage/Pinata)
- [ ] Research ZK login providers (Worldcoin, Polygon ID, or custom)
- [ ] Create .env.example template

### 1.5 Documentation Setup
- [ ] Create `/docs` folder
- [ ] Draft architecture.md outline
- [ ] Create deployment.md template
- [ ] Set up demo.md structure

**Deliverable:** Fully configured development environment

---

## Phase 2: Smart Contracts (Days 6-12)

### 2.1 Core Contract Development

#### ZKVerifier.sol (Days 6-7)
- [ ] Research ZK proof verification methods
- [ ] Define proof structure (Google/Email ZK login)
- [ ] Implement `verifyProof()` function
- [ ] Create user identity mapping (zkHash => exists)
- [ ] Add event emissions for verification
- [ ] Write unit tests

#### NewsRegistry.sol (Days 8-9)
- [ ] Define News struct (id, contentHash, submitter, timestamp, aiAnalysisHash)
- [ ] Implement `submitNews()` function
- [ ] Add news ID generation logic
- [ ] Store content hash and metadata
- [ ] Emit NewsSubmitted event
- [ ] Add getter functions
- [ ] Write unit tests

#### VoteManager.sol (Days 9-10)
- [ ] Define Vote enum (Real, Fake, Uncertain)
- [ ] Create voting mapping (newsId => voter => vote)
- [ ] Implement `castVote()` function with ZK verification
- [ ] Enforce one vote per ZK identity per news
- [ ] Track vote counts (real, fake, uncertain)
- [ ] Emit VoteCast event
- [ ] Add vote retrieval functions
- [ ] Write unit tests

#### Consensus Calculation (Client-Side) - Days 11-12
- [ ] Implement consensus algorithm in frontend (weighted average of AI + community)
- [ ] Create `calculateConsensus()` function in `scoreCalculation.ts`
- [ ] Set AI weight vs community weight parameters (40% AI, 60% community)
- [ ] Define verdict thresholds (>65% = Real, <35% = Fake, 36-64% = Uncertain)
- [ ] Implement real-time consensus updates after votes
- [ ] Add confidence scoring based on vote count and agreement
- [ ] Write unit tests

### 2.2 Contract Integration & Testing
- [ ] Create deployment script (`scripts/deploy.ts`)
- [ ] Deploy to local Hardhat network
- [ ] Test full contract interaction flow
- [ ] Deploy to Mantle Testnet
- [ ] Verify contracts on Mantle Explorer
- [ ] Create `scripts/seed.ts` for test data

### 2.3 Security & Optimization
- [ ] Review for reentrancy vulnerabilities
- [ ] Add access control where needed
- [ ] Optimize gas usage
- [ ] Consider upgradeability (if time permits)

**Deliverable:** Deployed and verified smart contracts on Mantle Testnet

---

## Phase 3: Backend & AI Oracle (Days 13-19)

### 3.1 Backend Setup (Day 13)
- [ ] Initialize Node.js/TypeScript project in `/backend`
- [ ] Install dependencies (Express/Fastify, ethers.js, dotenv)
- [ ] Create `src/index.ts` with basic server
- [ ] Set up environment variables
- [ ] Configure CORS for frontend

### 3.2 AI Fact Checker (Days 14-16)

#### AI Service Integration
- [ ] Create `src/ai/factChecker.ts`
- [ ] Design AI prompt for news analysis
- [ ] Integrate OpenAI/Claude API
- [ ] Implement source cross-referencing logic
- [ ] Create credibility scoring algorithm (0-100)
- [ ] Generate confidence explanation
- [ ] Add error handling and rate limiting

#### Trusted Sources Database
- [ ] Create `src/ai/sources.ts`
- [ ] Curate list of trusted news APIs (NewsAPI, BBC, Reuters)
- [ ] Implement source fetching functions
- [ ] Add caching layer

### 3.3 API Endpoints (Day 17)

#### Analysis Endpoint
- [ ] Create `src/routes/analyze.ts`
- [ ] POST `/api/analyze` - accepts news text/link
- [ ] Call AI fact checker
- [ ] Return credibility score + explanation
- [ ] Store analysis result (DB or IPFS)

#### Oracle Endpoint
- [ ] Create `src/routes/oracle.ts`
- [ ] POST `/api/oracle/submit` - pushes AI result to blockchain
- [ ] Connect to Mantle RPC via ethers.js
- [ ] Call `NewsRegistry.submitNews()` with analysis hash
- [ ] Return transaction hash

### 3.4 ZK Verification (Day 18)
- [ ] Create `src/zk/verifyProof.ts`
- [ ] Implement off-chain ZK proof verification
- [ ] Integrate with ZK login provider SDK
- [ ] Add proof caching mechanism

### 3.5 Storage & Utilities (Day 19)
- [ ] Create `src/utils/ipfs.ts` for IPFS uploads
- [ ] Create `src/utils/hash.ts` for content hashing
- [ ] Test end-to-end backend flow
- [ ] Add logging and monitoring

**Deliverable:** Functional backend API with AI analysis

---

## Phase 4: Frontend Development (Days 20-29)

### 4.1 Frontend Setup (Day 20)
- [ ] Initialize React/Vue project in `/frontend`
- [ ] Install dependencies (ethers.js/wagmi, axios, TailwindCSS)
- [ ] Set up routing (React Router/Vue Router)
- [ ] Create basic layout and navigation
- [ ] Configure environment variables

### 4.2 ZK Login Integration (Days 21-22)
- [ ] Create `src/hooks/useZKLogin.ts`
- [ ] Implement Google OAuth flow with ZK proof generation
- [ ] Implement email-based ZK login
- [ ] Store user session (localStorage/sessionStorage)
- [ ] Add login/logout UI components
- [ ] Test ZK proof verification with backend

### 4.3 Wallet & Contract Integration (Day 23)
- [ ] Create `src/hooks/useContracts.ts`
- [ ] Configure Mantle Testnet connection
- [ ] Set up contract ABIs and addresses
- [ ] Implement read functions (getNews, getVotes, getVerdict)
- [ ] Implement write functions (submitNews, castVote)
- [ ] Create `src/services/mantle.ts` for RPC config

### 4.4 Page Development (Days 24-26)

#### Home Page (Day 24)
- [ ] Create `src/pages/Home.tsx`
- [ ] Fetch and display latest news submissions
- [ ] Show verdict badges (Real/Fake/Uncertain/Pending)
- [ ] Add filtering and sorting options
- [ ] Implement infinite scroll or pagination

#### Submit Page (Day 25)
- [ ] Create `src/pages/Submit.tsx`
- [ ] Build news submission form (text + link)
- [ ] Add input validation
- [ ] Call backend `/api/analyze` endpoint
- [ ] Display AI analysis result preview
- [ ] Submit to blockchain via frontend
- [ ] Show transaction status and confirmation

#### Detail Page (Day 26)
- [ ] Create `src/pages/Detail.tsx`
- [ ] Display news content and metadata
- [ ] Show AI credibility score and explanation
- [ ] Display vote distribution (pie/bar chart)
- [ ] Render voting panel component
- [ ] Show final verdict if available

### 4.5 Component Development (Days 27-28)

#### VotePanel Component
- [ ] Create `src/components/VotePanel.tsx`
- [ ] Add Real/Fake/Uncertain buttons
- [ ] Disable voting if already voted
- [ ] Show loading state during transaction
- [ ] Display success/error messages
- [ ] Update vote counts in real-time

#### VerdictBadge Component
- [ ] Create `src/components/VerdictBadge.tsx`
- [ ] Design visual indicators (colors, icons)
- [ ] Show verdict type (Real/Fake/Uncertain/Pending)
- [ ] Add tooltip with details

#### Additional Components
- [ ] NewsCard component (for listing)
- [ ] AIScoreDisplay component
- [ ] LoadingSpinner component
- [ ] ErrorBoundary component

### 4.6 UI/UX Polish (Day 29)
- [ ] Apply consistent styling with TailwindCSS
- [ ] Add animations and transitions
- [ ] Implement responsive design (mobile/tablet/desktop)
- [ ] Add toast notifications
- [ ] Improve accessibility (ARIA labels, keyboard nav)

**Deliverable:** Fully functional frontend application

---

## Phase 5: Integration & Testing (Days 30-36)

### 5.1 End-to-End Integration (Days 30-31)
- [ ] Connect frontend to backend API
- [ ] Connect frontend to smart contracts
- [ ] Test full user flow:
  1. ZK login
  2. Submit news
  3. AI analysis
  4. On-chain voting
  5. View verdict
- [ ] Fix integration bugs

### 5.2 Testing (Days 32-34)

#### Smart Contract Testing
- [ ] Run all Hardhat tests
- [ ] Test edge cases (double voting, invalid proofs)
- [ ] Gas optimization testing

#### Backend Testing
- [ ] Test API endpoints with Postman/Insomnia
- [ ] Test AI analysis with various news samples
- [ ] Test error handling and rate limits

#### Frontend Testing
- [ ] Manual testing of all pages and components
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on different devices (mobile, tablet, desktop)
- [ ] Test wallet connection edge cases

### 5.3 Bug Fixes & Optimization (Days 35-36)
- [ ] Fix identified bugs
- [ ] Optimize API response times
- [ ] Reduce frontend bundle size
- [ ] Improve loading states
- [ ] Add error recovery mechanisms

**Deliverable:** Stable, tested application

---

## Phase 6: Deployment & Demo (Days 37-39)

### 6.1 Production Deployment (Day 37)
- [ ] Deploy backend to cloud service (Railway, Render, AWS)
- [ ] Configure environment variables for production
- [ ] Set up database if needed (PostgreSQL/MongoDB)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure custom domain (optional)
- [ ] Ensure contracts are verified on Mantle Explorer

### 6.2 Documentation (Day 38)
- [ ] Complete `docs/architecture.md` with diagrams
- [ ] Write `docs/deployment.md` with step-by-step guide
- [ ] Create `docs/demo.md` with demo script
- [ ] Update main README.md with:
  - Project description
  - Demo links
  - Installation instructions
  - Tech stack details
  - Team information
- [ ] Add screenshots/GIFs to docs

### 6.3 Demo Preparation (Day 39)
- [ ] Record demo video (3-5 minutes)
- [ ] Prepare pitch deck (optional)
- [ ] Create demo script highlighting:
  - Problem statement
  - Solution overview
  - Live demo walkthrough
  - Technical highlights (ZK, AI, Mantle)
  - Future roadmap
- [ ] Test demo flow multiple times
- [ ] Prepare answers for potential questions

### 6.4 Submission
- [ ] Submit project to hackathon platform
- [ ] Include all required links:
  - GitHub repository
  - Live demo URL
  - Demo video
  - Presentation deck
- [ ] Fill out submission form completely
- [ ] Submit before deadline

**Deliverable:** Deployed application + demo materials

---

## 🔧 Technical Specifications

### Smart Contracts
- **Language:** Solidity ^0.8.20
- **Framework:** Hardhat
- **Network:** Mantle Testnet (Chain ID: 5003)
- **Libraries:** OpenZeppelin Contracts

### Backend
- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Framework:** Express or Fastify
- **Blockchain:** ethers.js v6
- **AI:** OpenAI API or Anthropic Claude
- **Storage:** IPFS (Web3.Storage)

### Frontend
- **Framework:** React 18 or Vue 3
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State:** React Context/Redux or Pinia
- **Web3:** ethers.js or wagmi
- **Build:** Vite

---

## 📋 Pre-Flight Checklist

Before starting development:
- [ ] Mantle testnet MNT in wallet
- [ ] AI API key obtained
- [ ] ZK login provider researched
- [ ] IPFS service account created
- [ ] Team roles assigned
- [ ] Communication channels set up
- [ ] Hackathon deadline confirmed

---

## ⚠️ Risk Mitigation

### High Priority Risks
1. **ZK Login Complexity**
   - Mitigation: Start with simple OAuth + signature, add ZK later
   - Fallback: Use wallet-based authentication

2. **AI API Rate Limits**
   - Mitigation: Implement caching and request throttling
   - Fallback: Use pre-computed results for demo

3. **Mantle Testnet Instability**
   - Mitigation: Test early and often
   - Fallback: Have local Hardhat network as backup

4. **Time Constraints**
   - Mitigation: Follow MVP scope strictly
   - Fallback: Cut non-essential features (IPFS, advanced UI)

---

## 🎯 Success Criteria

### MVP Requirements (Must Have)
- ✅ ZK login functional
- ✅ News submission works
- ✅ AI analysis returns credibility score
- ✅ On-chain voting functional
- ✅ Final verdict displayed
- ✅ Deployed on Mantle Testnet
- ✅ Demo video completed

### Nice to Have
- Advanced reputation system
- Token incentives
- IPFS integration
- Multi-language support
- Mobile app

---

## 📞 Team Coordination

### Daily Standup (15 min)
- What did you complete yesterday?
- What will you work on today?
- Any blockers?

### Weekly Check-in (30 min)
- Review progress against timeline
- Adjust priorities if needed
- Demo current state

### Communication Channels
- GitHub for code and issues
- Discord/Slack for quick questions
- Video calls for complex discussions

---

## 🚀 Post-Hackathon

- Gather user feedback
- Fix critical bugs
- Implement token incentives
- Launch on Mantle Mainnet
- Apply for grants
- Build community

---

## 📝 Notes

- Prioritize functionality over aesthetics for MVP
- Document as you build
- Commit code frequently
- Test on Mantle Testnet early
- Have fun and learn!

---

**Good luck building ProofFeed! 🎉**