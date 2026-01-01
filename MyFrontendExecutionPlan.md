# My Frontend Execution Plan for ProofFeed

## Overview
Based on the ExecutionPlan.md and FrontendExecutionPlan.md, and after analyzing the existing Backend and SmartContract codebases, I will build a React-based frontend for the ProofFeed decentralized news validation platform. The frontend will integrate with the backend AI analysis API and the Mantle Testnet smart contracts.

## Project Structure
```
Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── news/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsList.tsx
│   │   │   ├── NewsDetail.tsx
│   │   │   └── SubmitNewsForm.tsx
│   │   ├── voting/
│   │   │   ├── VotePanel.tsx
│   │   │   └── VerdictBadge.tsx
│   │   ├── wallet/
│   │   │   ├── ConnectWallet.tsx
│   │   │   └── ZKVerification.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Loading.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Submit.tsx
│   │   ├── NewsDetail.tsx
│   │   └── About.tsx
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useContracts.ts
│   │   ├── useBackend.ts
│   │   └── useNews.ts
│   ├── contexts/
│   │   ├── WalletContext.tsx
│   │   └── NewsContext.tsx
│   ├── services/
│   │   ├── blockchain.ts
│   │   ├── api.ts
│   │   └── contracts.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── styles/
│       └── globals.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Web3:** ethers.js v6
- **State Management:** React Context
- **Routing:** React Router v6
- **Icons:** Lucide React

## Backend Integration
- **API Base URL:** http://localhost:3000/api (assuming backend runs on port 3000)
- **Endpoints:**
  - `POST /api/analyze` - Analyze news content with AI
  - `GET /api/health` - Health check

## Smart Contract Integration
- **Network:** Mantle Testnet (Chain ID: 5003)
- **RPC:** https://rpc.testnet.mantle.xyz
- **Contracts:**
  - NewsRegistry: Submit news with AI score
  - VoteManager: Cast votes on news
  - Consensus calculated client-side (no contract)
  - ZKVerifier: User verification

## Development Phases

### Phase 1: Project Setup (1 day)
1. Initialize Vite + React + TypeScript project
2. Install all dependencies
3. Configure TailwindCSS
4. Set up project structure
5. Configure React Router
6. Create basic layout components (Header, Footer)
7. Set up environment variables

### Phase 2: Wallet Integration (1 day)
1. Create WalletContext for state management
2. Implement MetaMask connection
3. Handle account and network changes
4. Create ConnectWallet component
5. Add network switching to Mantle Testnet
6. Test wallet connection flow

### Phase 3: ZK Verification (1 day)
1. Implement simplified ZK verification (for MVP)
2. Create ZKVerification component
3. Integrate with ZKVerifier contract
4. Handle user registration flow
5. Show verification status
6. Test registration process

### Phase 4: News Submission (2 days)
1. Create Submit page
2. Build SubmitNewsForm component
3. Integrate with backend /api/analyze endpoint
4. Display AI analysis results
5. Implement blockchain submission to NewsRegistry
6. Handle transaction status and errors
7. Add form validation
8. Test end-to-end submission flow

### Phase 5: News Display (1 day)
1. Create Home page with news list
2. Implement NewsCard component
3. Create NewsDetail page
4. Fetch news data from NewsRegistry contract
5. Display AI scores and metadata
6. Implement pagination/loading states
7. Test news browsing

### Phase 6: Voting System (1 day)
1. Create VotePanel component
2. Implement vote casting via VoteManager contract
3. Display vote counts and user's vote
4. Create VerdictBadge component
5. Integrate client-side consensus calculation
6. Handle vote changes and restrictions
7. Test voting functionality

### Phase 7: UI/UX Polish (2 days)
1. Add loading states and spinners
2. Implement error handling and user feedback
3. Add animations and transitions
4. Ensure responsive design (mobile/tablet/desktop)
5. Improve accessibility (ARIA labels, keyboard nav)
6. Add toast notifications for actions
7. Polish styling and consistency

### Phase 8: Testing & Deployment (2 days)
1. Manual testing of all user flows
2. Cross-browser testing (Chrome, Firefox)
3. Mobile device testing
4. Fix identified bugs
5. Optimize bundle size and performance
6. Deploy to Vercel/Netlify
7. Test production build
8. Update documentation

## Key Components Implementation

### WalletContext
- Manage wallet connection state
- Handle MetaMask events
- Provide contract instances
- Manage user verification status

### useContracts Hook
- Initialize ethers providers and signers
- Create contract instances with ABIs
- Provide read/write functions for all contracts

### useBackend Hook
- API client for backend endpoints
- Handle requests to /api/analyze and /api/health
- Error handling and retries

### useNews Hook
- Fetch news list from blockchain
- Get individual news details
- Real-time updates for votes/verdicts

## Integration Points
1. **Backend API:** Axios for HTTP requests
2. **Smart Contracts:** ethers.js for blockchain interactions
3. **Wallet:** MetaMask for user accounts and signing
4. **ZK Verification:** Simplified proof generation for MVP

## Testing Strategy
- Unit tests for utility functions
- Integration tests for contract interactions
- Manual testing for user flows
- Cross-browser compatibility
- Mobile responsiveness

## Deployment
- Build with Vite for production
- Deploy to Vercel/Netlify for hosting
- Configure environment variables for production
- Ensure CORS is set up for backend API

## Success Criteria
- All user flows functional (connect, verify, submit, vote, view)
- Responsive design works on all devices
- No console errors in production
- Fast loading times
- Intuitive user experience
- Full integration with backend and contracts

This plan follows the FrontendExecutionPlan.md closely while incorporating insights from the actual codebase implementation.