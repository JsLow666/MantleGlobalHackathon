# 📰 ProofFeed  
### AI-Assisted, Community-Driven News Credibility Platform on Mantle

---

## 📌 Overview

**ProofFeed** is a decentralized news credibility platform that helps users better understand the reliability of online information.

The platform combines **AI-assisted analysis**, **community discussion and voting**, and **privacy-preserving authentication** to produce transparent and verifiable credibility signals for news and public claims.

ProofFeed does **not** determine absolute truth.  
It provides **credibility signals** that help users make more informed decisions.

---

## 🚨 Problem

Online information spreads faster than verification.

Current solutions suffer from:
- Centralized control and opaque moderation
- Black-box AI fact-checking
- Bot manipulation and spam
- Lack of transparency and auditability
- Privacy-invasive identity systems

There is no open, verifiable, and privacy-preserving infrastructure for evaluating news credibility.

---

## 💡 Solution

ProofFeed introduces a **credibility signal layer** for news content by combining:

- **AI analysis** as an assistive signal
- **Human voting** as community consensus
- **Blockchain** as a transparent and tamper-resistant trust layer
- **Zero-knowledge login** to reduce Sybil attacks without exposing identity

---

## ✨ Features

### 🧠 AI-Assisted Analysis
- Evaluates submitted news for:
  - Source credibility
  - Claim consistency
  - Linguistic manipulation patterns
- Produces a **probabilistic credibility score and explanation**
- AI assists human judgment — it does not decide truth

---

### 🗳 Community Discussion & Voting
- Users can:
  - View submitted news
  - Vote on credibility (Credible / Misleading / Uncertain)
- Votes are recorded on-chain for transparency
- Final credibility signal reflects **AI + community input**

---

### 🔐 Privacy-Preserving Login
- Users sign in via:
  - Google
- Zero-knowledge verification ensures:
  - One-person-one-vote (best-effort)
  - Reduced bot and spam activity
  - No personal data stored on-chain

---

### ⛓ Built on Mantle
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

### `ZKVerifier.sol`
- Verifies zero-knowledge login proofs
- Prevents Sybil attacks

---

## 🔧 Core Functions

### News Submission
- Accepts text, links, or metadata
- Generates a content hash
- Stores references on-chain

---

### AI Evaluation
- Off-chain AI service analyzes content
- Produces credibility score + explanation
- Result is referenced on-chain

---

### Voting & Consensus
- Users vote via smart contracts
- One vote per verified ZK identity
- Consensus engine aggregates results

---

### Verification & Transparency
- All votes are immutable
- Credibility signals are auditable
- Third parties can consume results as an oracle feed

---

## 🛠 Tech Stack

| Layer | Technology |
|-----|-----------|
| Blockchain | Mantle Network (EVM) |
| Smart Contracts | Solidity, Hardhat |
| Frontend | React, TypeScript, Tailwind |
| Backend | Node.js, Express |
| AI | LLM-based fact analysis |
| Identity | Zero-knowledge login (OAuth-based) |

---

## ⚖️ Limitations & Disclaimer

- ProofFeed does **not** determine absolute truth
- AI assessments are probabilistic
- Community consensus reflects opinion, not fact
- Results should be treated as **credibility signals**

---

## 🛣 Roadmap

- Reputation-weighted voting
- Token-based incentives
- API for news platforms
- DAO-based governance
- Multi-language support

---

## 🏁 Conclusion

ProofFeed demonstrates how **AI, human judgment, and blockchain** can work together to improve transparency around online information.

Built on Mantle, it serves as an open experiment in creating verifiable credibility signals — without sacrificing privacy or decentralization.


---

## 🏃‍♂️ Steps to Run Locally

Follow these steps to run the ProofFeed project on your machine:

cd Frontend
npm install
npm run dev

Open Another terminal

cd Backend
npm install
npm run dev
