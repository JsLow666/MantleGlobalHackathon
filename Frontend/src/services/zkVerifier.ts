import { ethers } from 'ethers';

// ZKVerifier contract ABI (simplified)
const ZKVerifierABI = [
  "function verifyAndRegister(bytes32 zkHash, bytes calldata proof) external",
  "function isVerified(bytes32 zkHash) external view returns (bool)"
];

// Contract address - from environment or deployed contracts
const ZKVerifierAddress = import.meta.env.VITE_ZK_VERIFIER_ADDRESS || "0x99b690CffeE0B2Fc4fA7c7c6377fA894acc1170f";

export class ZKVerifierService {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
    this.contract = new ethers.Contract(ZKVerifierAddress, ZKVerifierABI, signer);
    console.log('ZKVerifierService initialized with contract address:', ZKVerifierAddress);
    this.checkContractConnection();
  }

  private async checkContractConnection(): Promise<void> {
    try {
      // Try to call a view function to check if contract is accessible
      const code = await this.provider.getCode(ZKVerifierAddress);
      if (code === '0x') {
        console.error('❌ ZKVerifier: Contract not found at address:', ZKVerifierAddress);
      } else {
        console.log('✅ ZKVerifier: Contract found at address:', ZKVerifierAddress);
      }
    } catch (error) {
      console.error('❌ ZKVerifier: Error checking contract connection:', error);
    }
  }

  async verifyAndRegister(zkHash: string, proof: string): Promise<boolean> {
    try {
      console.log('🔐 ZKVerifier: Starting verifyAndRegister transaction...');
      console.log('📝 zkHash:', zkHash);
      console.log('📝 proof length:', proof.length);

      const tx = await this.contract.verifyAndRegister(zkHash, proof);
      console.log('📤 Transaction sent:', tx.hash);

      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);
      console.log('📊 Gas used:', receipt.gasUsed.toString());

      return true;
    } catch (error) {
      console.error('❌ ZKVerifier: Error registering user:', error);
      return false;
    }
  }

  async isVerified(zkHash: string): Promise<boolean> {
    try {
      console.log('🔍 ZKVerifier: Checking verification status for:', zkHash);
      const result = await this.contract.isVerified(zkHash);
      console.log('✅ ZKVerifier: Verification status:', result);
      return result;
    } catch (error) {
      console.error('❌ ZKVerifier: Error checking verification:', error);
      return false;
    }
  }
}