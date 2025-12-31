import { ethers } from 'ethers';
import { ZKVerifierService } from '@/services/zkVerifier';

declare global {
  interface Window {
    google: any;
  }
}

export interface UserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export class GoogleAuthService {
  private zkVerifier: ZKVerifierService;
  private clientId: string;

  constructor(provider: ethers.Provider, signer: ethers.Signer, clientId?: string) {
    this.zkVerifier = new ZKVerifierService(provider, signer);
    this.clientId = clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '112188200362-d79147iqr0s7m2fvu9qvvgcpmk329a73.apps.googleusercontent.com';
  }

  initGoogleAuth(callback: (userInfo: UserInfo) => void): void {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => this.initializeGoogleSignIn(callback);
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn(callback: (userInfo: UserInfo) => void): void {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response, callback),
      auto_select: false,
    });

    // Render the sign-in button
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button')!,
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
      }
    );
  }

  private decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  private async handleCredentialResponse(response: any, callback: (userInfo: UserInfo) => void): Promise<void> {
    try {
      console.log('🔑 GoogleAuth: Processing credential response...');
      const payload = this.decodeJWT(response.credential);
      const userInfo: UserInfo = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      console.log('👤 GoogleAuth: User info extracted:', { sub: userInfo.sub, email: userInfo.email, name: userInfo.name });

      // Generate zkHash from user identity
      const zkHash = this.generateZkHash(userInfo.sub);
      console.log('🔢 GoogleAuth: Generated zkHash:', zkHash);

      // Check if user is already verified
      console.log('🔍 GoogleAuth: Checking if user is already verified...');
      const alreadyVerified = await this.zkVerifier.isVerified(zkHash);

      if (alreadyVerified) {
        console.log('✅ GoogleAuth: User already verified, skipping registration');
        callback(userInfo);
        return;
      }

      // Generate ZK proof (MVP: simplified)
      const proof = this.generateDummyProof(zkHash);
      console.log('🔒 GoogleAuth: Generated proof (length):', proof.length);

      // Register with ZKVerifier contract
      console.log('📝 GoogleAuth: Calling ZKVerifier.verifyAndRegister...');
      const success = await this.zkVerifier.verifyAndRegister(zkHash, proof);

      if (success) {
        console.log('✅ GoogleAuth: User successfully registered with ZKVerifier');
        callback(userInfo);
      } else {
        console.error('❌ GoogleAuth: Failed to register with ZKVerifier');
        throw new Error('Failed to register with ZKVerifier');
      }
    } catch (error) {
      console.error('❌ GoogleAuth: Authentication error:', error);
      throw error;
    }
  }

  private generateZkHash(sub: string): string {
    // Generate zkHash from user identity (sub + salt)
    const salt = 'mantle-hackathon-salt'; // In production, use random salt
    const hashInput = sub + salt;
    return ethers.keccak256(ethers.toUtf8Bytes(hashInput));
  }

  private generateDummyProof(zkHash: string): string {
    // MVP: Generate dummy proof that passes simplified contract verification
    // In production, this would be a real ZK proof generated as follows:
    //
    // 1. Define a Circom circuit that proves knowledge of valid Google OAuth credentials
    //    - Circuit verifies JWT signature validity
    //    - Proves user has authenticated Google account
    //    - Outputs zkHash without revealing identity
    //
    // 2. Generate witness with private inputs (JWT components) and public inputs (zkHash)
    //
    // 3. Use snarkjs to generate proof:
    //    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    //      witness, circuitWasm, provingKey
    //    );
    //
    // 4. Serialize proof for contract submission
    //
    // The contract's _verifyProof requires:
    // - proof.length >= 32
    // - keccak256(proof) != 0
    // - zkHash != 0

    // Generate 64 bytes of random data
    const randomBytes = ethers.randomBytes(64);
    return ethers.hexlify(randomBytes);
  }

  async checkVerification(userInfo: UserInfo): Promise<boolean> {
    const zkHash = this.generateZkHash(userInfo.sub);
    return await this.zkVerifier.isVerified(zkHash);
  }
}