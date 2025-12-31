import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { GoogleLogin } from '../components/auth/GoogleLogin';
import { UserInfo } from '../services/auth';
import { Wallet, Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { account, isConnecting, connectWallet, verifyZK } = useWallet();
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // If both wallet connected and Google logged in, redirect to dashboard
    // Note: ZK verification is handled during Google login
    if (account && googleLoggedIn) {
      navigate('/dashboard');
    }
  }, [account, googleLoggedIn, navigate]);

  const handleGoogleLoginSuccess = async (user: UserInfo) => {
    setGoogleLoggedIn(true);
    setUserInfo(user);
    
    // Update WalletContext verification status since ZK verification was done during Google login
    try {
      await verifyZK(); // This will update localStorage and state
    } catch (error) {
      console.error('Failed to update verification status:', error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Accounts
          </h1>
          <p className="text-gray-600">
            Connect your MetaMask wallet and sign in with Google to access ProofFeed
          </p>
        </div>

        <div className="space-y-6">
          {/* MetaMask Connection */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="h-6 w-6 text-orange-500" />
                <span className="font-medium">MetaMask Wallet</span>
              </div>
              {account ? (
                <div className="text-green-600 text-sm">✓ Connected</div>
              ) : (
                <div className="text-gray-400 text-sm">Not Connected</div>
              )}
            </div>

            {account ? (
              <div className="text-sm text-gray-600">
                <p>Address: {account.slice(0, 6)}...{account.slice(-4)}</p>
                <p className="text-green-600">Connected ✓</p>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect MetaMask'
                )}
              </button>
            )}
          </div>

          {/* Google Login */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">G</div>
                <span className="font-medium">Google Account</span>
              </div>
              {googleLoggedIn ? (
                <div className="text-green-600 text-sm">✓ Signed In</div>
              ) : (
                <div className="text-gray-400 text-sm">Not Signed In</div>
              )}
            </div>

            {googleLoggedIn && userInfo ? (
              <div className="text-sm text-gray-600">
                <p>Welcome, {userInfo.name}</p>
                <p>{userInfo.email}</p>
              </div>
            ) : account ? (
              <GoogleLogin onLoginSuccess={handleGoogleLoginSuccess} />
            ) : (
              <div className="text-center text-gray-500 text-sm">
                Please connect your wallet first
              </div>
            )}
          </div>
        </div>

        {account && googleLoggedIn && (
          <div className="mt-6 text-center">
            <div className="text-green-600 font-medium mb-2">
              Authentication Complete!
            </div>
            <p className="text-sm text-gray-600">
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;