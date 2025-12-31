# Phase 4: Frontend Development - Execution Plan

## 🎯 Goal

Build a React-based frontend for ProofFeed that allows users to:
1. Connect wallet (MetaMask)
2. Register with ZK verification
3. Submit news (get AI analysis, submit to blockchain)
4. Vote on news credibility
5. View consensus results

---

## 📅 Timeline: 7-10 Days

- **Day 1-2**: Project setup & wallet integration
- **Day 3-4**: News submission flow
- **Day 5-6**: Voting interface & news display
- **Day 7-8**: UI/UX polish & responsive design
- **Day 9-10**: Testing & deployment

---

## 🛠️ Tech Stack

**Framework:** React 18 with TypeScript
**Build Tool:** Vite
**Styling:** TailwindCSS
**Web3:** ethers.js v6 + wagmi (optional)
**State:** React Context / Zustand
**Routing:** React Router
**Icons:** Lucide React
**UI Components:** shadcn/ui (optional)

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Main app component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Navigation & wallet
│   │   │   └── Footer.tsx        # Footer
│   │   ├── news/
│   │   │   ├── NewsCard.tsx      # News item display
│   │   │   ├── NewsList.tsx      # List of news
│   │   │   ├── NewsDetail.tsx    # Full news view
│   │   │   └── SubmitNews.tsx    # Submission form
│   │   ├── voting/
│   │   │   ├── VotePanel.tsx     # Vote buttons
│   │   │   └── VerdictBadge.tsx  # Result indicator
│   │   ├── wallet/
│   │   │   ├── ConnectWallet.tsx # Wallet connection
│   │   │   └── ZKVerify.tsx      # ZK verification
│   │   └── common/
│   │       ├── Button.tsx        # Reusable button
│   │       ├── Card.tsx          # Card component
│   │       ├── Loading.tsx       # Loading spinner
│   │       └── Modal.tsx         # Modal dialog
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Submit.tsx            # Submit news page
│   │   ├── NewsPage.tsx          # News detail page
│   │   └── About.tsx             # About page
│   ├── hooks/
│   │   ├── useWallet.ts          # Wallet connection
│   │   ├── useContracts.ts       # Contract interactions
│   │   ├── useBackend.ts         # Backend API calls
│   │   └── useNews.ts            # News data fetching
│   ├── contexts/
│   │   ├── WalletContext.tsx     # Wallet state
│   │   └── NewsContext.tsx       # News state
│   ├── services/
│   │   ├── blockchain.ts         # Web3 service
│   │   ├── api.ts                # Backend API
│   │   └── contracts.ts          # Contract ABIs
│   ├── utils/
│   │   ├── formatters.ts         # Data formatting
│   │   ├── constants.ts          # Constants
│   │   └── helpers.ts            # Helper functions
│   └── styles/
│       └── globals.css           # Global styles
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

---

## 🔄 User Flows

### Flow 1: First-Time User
```
1. Visit site
2. Click "Connect Wallet"
3. MetaMask prompts connection
4. User connects wallet
5. System checks if ZK-verified
6. If not verified → Prompt ZK registration
7. User completes ZK verification
8. Now can submit news & vote
```

### Flow 2: Submit News
```
1. User clicks "Submit News"
2. Fill form (title, content, URL)
3. Click "Analyze with AI"
4. Backend returns AI score
5. Show AI score to user
6. User reviews and clicks "Submit to Blockchain"
7. MetaMask prompts for signature
8. User confirms & pays gas
9. Transaction submitted
10. Show success with news ID
```

### Flow 3: Vote on News
```
1. User browses news list
2. Clicks on a news item
3. Views details & AI score
4. Sees voting panel
5. Clicks Real/Fake/Uncertain
6. MetaMask prompts for signature
7. User confirms & pays gas
8. Vote recorded on blockchain
9. Vote counts update in real-time
```

---

## 📋 Component Specifications

### Header Component
- Logo & branding
- Navigation links (Home, Submit, About)
- Wallet connection button
- Account display (when connected)
- Network indicator (Mantle Testnet)

### NewsCard Component
```typescript
interface NewsCardProps {
  newsId: number;
  title: string;
  sourceUrl: string;
  aiScore: number;
  submitter: string;
  timestamp: number;
  voteCounts: {
    real: number;
    fake: number;
    uncertain: number;
  };
  verdict?: 'Real' | 'Fake' | 'Uncertain' | 'Pending';
}
```

### VotePanel Component
```typescript
interface VotePanelProps {
  newsId: number;
  hasVoted: boolean;
  userVote?: 'Real' | 'Fake' | 'Uncertain';
  onVote: (voteType: number) => Promise<void>;
}
```

### SubmitNews Component
- Title input (200 char max)
- Content textarea (10,000 char max)
- Source URL input
- "Analyze with AI" button
- AI score display
- Reasoning display
- "Submit to Blockchain" button
- Gas estimate display
- Transaction status

---

## 🎨 Design System

### Colors
```css
--primary: #3B82F6 (blue)
--success: #10B981 (green)
--warning: #F59E0B (amber)
--danger: #EF4444 (red)
--neutral: #6B7280 (gray)
```

### Verdict Colors
```css
--real: #10B981 (green)
--fake: #EF4444 (red)
--uncertain: #F59E0B (amber)
--pending: #6B7280 (gray)
```

### Typography
```css
--font-heading: 'Inter', sans-serif
--font-body: 'Inter', sans-serif
--font-mono: 'Fira Code', monospace
```

---

## 🔌 API Integration

### Backend API
```typescript
// GET AI Analysis
POST /api/analyze
Body: { content, title, sourceUrl }
Returns: { score, verdict, explanation, ... }

// Health Check
GET /api/health
Returns: { status, services, ... }
```

### Smart Contracts
```typescript
// NewsRegistry
submitNews(contentHash, title, url, aiScore)
getNews(newsId)
getLatestNews(count)

// VoteManager
castVote(newsId, voteType)
getVoteCounts(newsId)
haveIVoted(newsId)

// ConsensusEngine
getResult(newsId)
calculateVerdict(newsId)

// ZKVerifier
verifyAndRegister(zkHash, proof)
isVerified(zkHash)
```

---

## 🧪 Testing Checklist

### Wallet Connection
- [ ] Can connect MetaMask
- [ ] Shows correct account
- [ ] Shows correct network
- [ ] Handles account change
- [ ] Handles network change
- [ ] Handles disconnect

### ZK Verification
- [ ] Can register new user
- [ ] Prevents duplicate registration
- [ ] Shows verification status
- [ ] Handles errors gracefully

### News Submission
- [ ] Form validation works
- [ ] AI analysis displays correctly
- [ ] Transaction confirmation works
- [ ] Gas estimate accurate
- [ ] Success message shows
- [ ] Redirects to news page

### Voting
- [ ] Vote buttons work
- [ ] Prevents double voting
- [ ] Shows user's vote
- [ ] Updates counts real-time
- [ ] Gas confirmation works

### News Display
- [ ] News list loads
- [ ] Pagination works
- [ ] News detail loads
- [ ] AI score displays
- [ ] Verdict badge shows correct color
- [ ] Vote counts accurate

---

## 🚀 Development Phases

### Phase 4.1: Setup (Day 1)
- [ ] Initialize Vite + React + TypeScript
- [ ] Install dependencies
- [ ] Setup TailwindCSS
- [ ] Create folder structure
- [ ] Setup routing
- [ ] Create basic layout

### Phase 4.2: Wallet Integration (Day 2)
- [ ] Create WalletContext
- [ ] Implement wallet connection
- [ ] Handle account changes
- [ ] Handle network changes
- [ ] Create ConnectWallet component
- [ ] Test wallet flow

### Phase 4.3: ZK Verification (Day 2)
- [ ] Implement ZK proof generation (simplified)
- [ ] Create registration UI
- [ ] Integrate with ZKVerifier contract
- [ ] Show verification status
- [ ] Test registration flow

### Phase 4.4: News Submission (Day 3-4)
- [ ] Create SubmitNews page
- [ ] Build submission form
- [ ] Integrate backend AI analysis
- [ ] Show AI results
- [ ] Implement blockchain submission
- [ ] Handle transaction status
- [ ] Test end-to-end submission

### Phase 4.5: News Display (Day 5)
- [ ] Create Home page with news list
- [ ] Create NewsCard component
- [ ] Implement pagination
- [ ] Create NewsDetail page
- [ ] Fetch news from blockchain
- [ ] Display AI scores & votes
- [ ] Test news display

### Phase 4.6: Voting (Day 6)
- [ ] Create VotePanel component
- [ ] Implement vote submission
- [ ] Show vote counts
- [ ] Show user's vote
- [ ] Create VerdictBadge
- [ ] Real-time updates
- [ ] Test voting flow

### Phase 4.7: UI/UX Polish (Day 7-8)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Improve animations
- [ ] Responsive design
- [ ] Dark mode (optional)
- [ ] Accessibility improvements

### Phase 4.8: Testing & Deployment (Day 9-10)
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Deploy to Vercel/Netlify
- [ ] Test production build

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "ethers": "^6.9.2",
    "axios": "^1.6.5",
    "lucide-react": "^0.303.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
```

---

## 🎯 Success Criteria

Frontend is complete when:

- [ ] Users can connect wallet
- [ ] Users can register (ZK verification)
- [ ] Users can submit news
- [ ] AI analysis displays correctly
- [ ] Users can vote on news
- [ ] News list displays correctly
- [ ] News details show full info
- [ ] Verdict calculations display
- [ ] All transactions work
- [ ] UI is responsive
- [ ] No console errors
- [ ] Deployed and accessible

---

## 🚀 Ready to Start!

Let's begin with **Phase 4.1: Project Setup**!

Would you like me to:
1. Create the complete Vite + React + TypeScript setup?
2. Generate all the configuration files?
3. Build the wallet integration?
4. Or start with any specific component?