import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProofFeedDeploymentModule", (m) => {
  // ===== Oracle setup =====
  // Use deployer address as oracle for now

  // ===== Step 1: Deploy ZKVerifier =====
  const zkVerifier = m.contract("ZKVerifier");

  // ===== Step 2: Deploy NewsRegistry =====
  const newsRegistry = m.contract("NewsRegistry", [zkVerifier]);

  // ===== Step 3: Deploy VoteManager =====
  const voteManager = m.contract("VoteManager", [zkVerifier, newsRegistry]);

  // ConsensusEngine removed - consensus calculated client-side

  return {
    zkVerifier,
    newsRegistry,
    voteManager,
  };
});