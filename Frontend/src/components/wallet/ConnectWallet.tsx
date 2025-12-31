import { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { Wallet, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ConnectWallet = () => {
  const { account, chainId, isConnecting, connectWallet } = useWallet();

  const MANTLE_TESTNET_CHAIN_ID = 5003;

  const getNetworkIndicator = () => {
    if (!account) return null;

    if (chainId === MANTLE_TESTNET_CHAIN_ID) {
      return (
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span>Mantle Sepolia</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>Wrong Network</span>
        </div>
      );
    }
  };

  if (account) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          {getNetworkIndicator()}
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-primary flex items-center space-x-2 disabled:opacity-50"
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    </div>
  );
};

export default ConnectWallet;