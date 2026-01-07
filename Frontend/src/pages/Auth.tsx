import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { GoogleLogin } from '../components/auth/GoogleLogin';
import { UserInfo } from '../services/auth';
import { Wallet, Loader2, Cpu } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { account, isConnecting, connectWallet, verifyZK } = useWallet();
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (account && googleLoggedIn) {
      navigate('/dashboard');
    }
  }, [account, googleLoggedIn, navigate]);

  const handleGoogleLoginSuccess = async (user: UserInfo) => {
    setGoogleLoggedIn(true);
    setUserInfo(user);
    try {
      await verifyZK();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-cyan-300 relative overflow-hidden">
      {/* Neon background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.15),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,0,255,0.12),_transparent_45%)]" />

      <div className="relative z-10 w-full max-w-md border border-cyan-500/30 rounded-xl bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.2)] p-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Cpu className="h-10 w-10 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-cyan-400">
            PROOFFEED ACCESS
          </h1>
          <p className="text-sm text-cyan-300/70 mt-3">
            Authenticate via wallet + zero-knowledge Google identity
          </p>
        </div>

        <div className="space-y-6">
          {/* Wallet */}
          <div className="border border-cyan-500/30 rounded-lg p-4 bg-black/60 hover:border-cyan-400 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="h-6 w-6 text-orange-400" />
                <span className="font-medium tracking-wide">MetaMask Wallet</span>
              </div>
              <span className={`text-xs ${account ? 'text-green-400' : 'text-cyan-300/50'}`}>
                {account ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {account ? (
              <div className="text-xs text-cyan-300/70 space-y-1">
                <p>Address:</p>
                <p className="font-mono text-cyan-400">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full mt-2 py-2 rounded-md bg-gradient-to-r from-orange-500 to-pink-500 text-black font-semibold tracking-wide hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    LINKING...
                  </>
                ) : (
                  'CONNECT METAMASK'
                )}
              </button>
            )}
          </div>

          {/* Google */}
          <div className="border border-fuchsia-500/30 rounded-lg p-4 bg-black/60 hover:border-fuchsia-400 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-xl font-bold text-fuchsia-400">G</div>
                <span className="font-medium tracking-wide">Google Identity</span>
              </div>
              <span className={`text-xs ${googleLoggedIn ? 'text-green-400' : 'text-cyan-300/50'}`}>
                {googleLoggedIn ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>

            {googleLoggedIn && userInfo ? (
              <div className="text-xs text-cyan-300/70 space-y-1">
                <p className="text-green-400">WELCOME</p>
                <p>{userInfo.name}</p>
                <p className="font-mono">{userInfo.email}</p>
              </div>
            ) : account ? (
              <GoogleLogin onLoginSuccess={handleGoogleLoginSuccess} />
            ) : (
              <div className="text-center text-xs text-cyan-300/50">
                Wallet link required
              </div>
            )}
          </div>
        </div>

        {account && googleLoggedIn && (
          <div className="mt-8 text-center">
            <p className="text-green-400 font-semibold tracking-widest">
              ACCESS GRANTED
            </p>
            <p className="text-xs text-cyan-300/60 mt-1">
              Initializing dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
