import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../contexts/WalletContext';
import { Shield, Loader2, Chrome, Mail } from 'lucide-react';

const ZKVerification = ({ onClose }: { onClose?: () => void }) => {
  const { account, isVerified, verifyZK } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');

  const handleGoogleOAuthZK = async () => {
    setIsVerifying(true);
    try {
      console.log('🔐 Starting Google OAuth ZK verification...');

      // Simulate Google OAuth popup
      console.log('🔗 Opening Google OAuth popup...');

      // For demo purposes, simulate OAuth success
      // In production, this would open actual Google OAuth
      const mockOAuthResult = await simulateGoogleOAuth();

      if (mockOAuthResult.success) {
        console.log('✅ Google OAuth successful, generating ZK proof...');

        // Generate ZK-like proof from OAuth result
        const zkProof = await generateZKProofFromOAuth(mockOAuthResult);

        console.log('📝 ZK proof generated:', zkProof);

        // Submit to verification
        await verifyZKWithProof(zkProof);

        console.log('✅ Google OAuth ZK verification successful!');
        alert('Google OAuth ZK Verification successful! You can now submit news and vote.');
        onClose?.();
      } else {
        throw new Error('OAuth cancelled or failed');
      }
    } catch (error: any) {
      console.error('❌ Google OAuth ZK verification failed:', error);
      alert(`Google OAuth ZK verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEmailZK = async () => {
    if (!email.trim()) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('🔐 Starting Email ZK verification...');

      // Simulate email verification
      const mockEmailResult = await simulateEmailVerification(email);

      if (mockEmailResult.success) {
        console.log('✅ Email verification successful, generating ZK proof...');

        // Generate ZK-like proof from email
        const zkProof = await generateZKProofFromEmail(mockEmailResult);

        console.log('📝 ZK proof generated:', zkProof);

        // Submit to verification
        await verifyZKWithProof(zkProof);

        console.log('✅ Email ZK verification successful!');
        alert('Email ZK Verification successful! You can now submit news and vote.');
        onClose?.();
      } else {
        throw new Error('Email verification failed');
      }
    } catch (error: any) {
      console.error('❌ Email ZK verification failed:', error);
      alert(`Email ZK verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulate Google OAuth flow
  const simulateGoogleOAuth = async () => {
    return new Promise<{success: boolean, token?: string}>((resolve) => {
      // Simulate OAuth popup delay
      setTimeout(() => {
        // For demo, assume success
        resolve({
          success: true,
          token: `google_oauth_token_${Date.now()}`
        });
      }, 2000);
    });
  };

  // Simulate Email verification
  const simulateEmailVerification = async (email: string) => {
    return new Promise<{success: boolean, email: string}>((resolve) => {
      // Simulate email verification delay
      setTimeout(() => {
        // For demo, assume success
        resolve({
          success: true,
          email
        });
      }, 1500);
    });
  };

  // Generate ZK-like proof from OAuth result
  const generateZKProofFromOAuth = async (oauthResult: {success: boolean, token?: string}) => {
    if (!oauthResult.token) throw new Error('No OAuth token');

    // Simulate ZK proof generation
    // In production, this would use actual ZK proving
    const proof = ethers.keccak256(
      ethers.toUtf8Bytes(`zk_proof_oauth_${oauthResult.token}_${account}_${Date.now()}`)
    );

    return proof;
  };

  // Generate ZK-like proof from Email
  const generateZKProofFromEmail = async (emailResult: {success: boolean, email: string}) => {
    if (!emailResult.email) throw new Error('No email provided');

    // Simulate ZK proof generation
    const proof = ethers.keccak256(
      ethers.toUtf8Bytes(`zk_proof_email_${emailResult.email}_${account}_${Date.now()}`)
    );

    return proof;
  };

  // Verify with ZK proof
  const verifyZKWithProof = async (proof: string) => {
    // Call the context's verifyZK with the proof
    await verifyZK(proof);
  };

  if (!account) {
    return null; // Should not render if no account
  }

  if (isVerified) {
    return null; // Should not render if verified
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">ZK Identity Verification</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Choose a provider to verify your identity using zero-knowledge proofs.
        This proves you own an account without revealing your identity.
      </p>

      {/* Provider Selection */}
      <div className="space-y-3 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedProvider('google')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
              selectedProvider === 'google'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Chrome className="h-4 w-4" />
            <span>Google</span>
          </button>
          <button
            onClick={() => setSelectedProvider('email')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
              selectedProvider === 'email'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
        </div>

        {selectedProvider === 'email' && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      <button
        onClick={selectedProvider === 'google' ? handleGoogleOAuthZK : handleEmailZK}
        disabled={isVerifying || (selectedProvider === 'email' && !email.trim())}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span>Verify with {selectedProvider === 'google' ? 'Google' : 'Email'}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-2">
        {selectedProvider === 'google'
          ? 'This will open a Google OAuth popup and generate a ZK proof.'
          : 'This will verify your email and generate a ZK proof.'
        }
      </p>
    </div>
  );
};

export default ZKVerification;