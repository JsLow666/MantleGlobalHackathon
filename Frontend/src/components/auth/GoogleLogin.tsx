import React, { useEffect, useState } from 'react';
import { GoogleAuthService, UserInfo } from '@/services/auth';
import { useWallet } from '@/contexts/WalletContext';

interface GoogleLoginProps {
  onLoginSuccess: (userInfo: UserInfo) => void;
}

export const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLoginSuccess }) => {
  const { provider, signer } = useWallet();
  const [authService, setAuthService] = useState<GoogleAuthService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider && signer) {
      console.log('🔗 GoogleLogin: Wallet connected, initializing Google Auth Service...');
      const service = new GoogleAuthService(provider, signer);
      setAuthService(service);

      console.log('🌐 GoogleLogin: Initializing Google Sign-In...');
      service.initGoogleAuth((userInfo) => {
        console.log('✅ GoogleLogin: Login successful for user:', userInfo.email);
        setIsLoading(false);
        onLoginSuccess(userInfo);
      });
    } else {
      console.log('⚠️ GoogleLogin: Wallet not connected, waiting for connection...');
    }
  }, [provider, signer, onLoginSuccess]);

  const handleLoginClick = () => {
    setIsLoading(true);
    // The actual login is handled by Google button click
  };

  if (!provider || !signer) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please connect your wallet first to use Google OAuth.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div id="google-signin-button"></div>
      {isLoading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying with ZK proof...</p>
        </div>
      )}
    </div>
  );
};