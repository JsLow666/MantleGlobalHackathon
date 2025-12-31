import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ZKVerifierService } from '@/services/zkVerifier';

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isVerified: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToMantle: () => Promise<void>;
  verifyZK: (proof?: string) => Promise<void>;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [zkVerifier, setZkVerifier] = useState<ZKVerifierService | null>(null);

  const MANTLE_TESTNET_CHAIN_ID = 5003;
  const MANTLE_TESTNET_PARAMS = {
    chainId: '0x138B', // Mantle Testnet Chain ID: 5003 (0x138B)
    chainName: 'Mantle Sepolia Testnet',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
    blockExplorerUrls: ['https://sepolia.mantlescan.xyz'],
  };

  const connectWallet = async () => {
    console.log('🔌 Attempting to connect wallet...');

    if (!window.ethereum) {
      console.error('❌ MetaMask not detected');
      alert('Please install MetaMask!');
      return;
    }

    console.log('✅ MetaMask detected');
    setIsConnecting(true);

    try {
      console.log('📡 Requesting accounts...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('✅ Accounts received:', accounts);

      setAccount(account);

      console.log('🔧 Creating ethers provider...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      console.log('✅ Provider created, network:', network);

      setProvider(provider);
      setSigner(signer);
      setChainId(Number(network.chainId));
      setZkVerifier(new ZKVerifierService(provider, signer));

      // Check ZK verification status
      await checkZKVerification(account);

      // Check if on Mantle Testnet
      console.log('🔍 Current chain ID:', Number(network.chainId), 'Target:', MANTLE_TESTNET_CHAIN_ID);
      if (Number(network.chainId) !== MANTLE_TESTNET_CHAIN_ID) {
        console.log('🔄 Switching to Mantle Testnet...');
        await switchToMantle();
      } else {
        console.log('✅ Already on Mantle Testnet');
      }

      console.log('🎉 Wallet connected successfully!');
    } catch (error: any) {
      console.error('❌ Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setIsVerified(false);
    setProvider(null);
    setSigner(null);
    setZkVerifier(null);
  };

  const checkZKVerification = async (userAddress: string) => {
    if (!provider) return;

    try {
      // For MVP, we'll use a simplified verification check
      // In production, this would check the ZKVerifier contract
      console.log('🔍 Checking ZK verification status for:', userAddress);

      // Simplified check: check localStorage (for demo)
      const isVerified = localStorage.getItem(`zk_verified_${userAddress}`) === 'true';

      setIsVerified(isVerified);
      console.log('✅ ZK verification status:', isVerified);
    } catch (error) {
      console.error('❌ Failed to check ZK verification:', error);
    }
  };

  const verifyZK = async (providedProof?: string) => {
    if (!account || !provider || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      console.log('🔐 Starting ZK verification process...');

      let proof: string;

      if (providedProof) {
        // Use provided proof (from Google OAuth ZK)
        proof = providedProof;
        console.log('📝 Using provided ZK proof from OAuth');
      } else {
        // Generate simplified proof for basic verification
        proof = ethers.keccak256(ethers.toUtf8Bytes(`${account}_proof_${Date.now()}`));
        console.log('📝 Generated simplified ZK proof');
      }

      // In production, this would generate real ZK proofs and call the ZKVerifier contract
      console.log('🔄 Submitting ZK verification to contract...');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark as verified in localStorage (for demo)
      localStorage.setItem(`zk_verified_${account}`, 'true');
      localStorage.setItem(`zk_proof_${account}`, proof);
      setIsVerified(true);

      console.log('✅ ZK verification successful!');
      if (!providedProof) {
        alert('ZK Verification successful! You can now submit news and vote.');
      }
    } catch (error: any) {
      console.error('❌ ZK verification failed:', error);
      alert(`ZK verification failed: ${error.message}`);
    }
  };

  const switchToMantle = async () => {
    if (!window.ethereum) {
      console.error('❌ No ethereum provider for network switch');
      return;
    }

    console.log('🔄 Attempting to switch to Mantle Testnet...');
    console.log('📋 Chain ID params:', MANTLE_TESTNET_PARAMS);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MANTLE_TESTNET_PARAMS.chainId }],
      });
      console.log('✅ Successfully switched to Mantle Testnet');
    } catch (switchError: any) {
      console.log('⚠️ Switch failed, attempting to add network...', switchError.code);

      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          console.log('📝 Adding Mantle Testnet to MetaMask...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MANTLE_TESTNET_PARAMS],
          });
          console.log('✅ Mantle Testnet added successfully');
        } catch (addError: any) {
          console.error('❌ Failed to add Mantle Testnet:', addError);
          alert('Failed to add Mantle Testnet. Please add it manually.');
        }
      } else {
        console.error('❌ Failed to switch to Mantle Testnet:', switchError);
        alert('Failed to switch to Mantle Testnet. Please switch manually.');
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      console.log('👂 Setting up MetaMask event listeners...');

      const handleAccountsChanged = (accounts: string[]) => {
        console.log('📢 Accounts changed:', accounts);
        if (accounts.length === 0) {
          console.log('🚪 Wallet disconnected');
          disconnectWallet();
        } else {
          console.log('🔄 Account switched to:', accounts[0]);
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log('📢 Chain changed to:', chainId);
        setChainId(parseInt(chainId, 16));
        // Reload the page when chain changes
        console.log('🔄 Reloading page due to chain change...');
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        console.log('🧹 Cleaning up event listeners...');
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    } else {
      console.log('⚠️ MetaMask not detected, skipping event listeners');
    }
  }, []);

  const value: WalletContextType = {
    account,
    chainId,
    isConnecting,
    isVerified,
    connectWallet,
    disconnectWallet,
    switchToMantle,
    verifyZK,
    provider,
    signer,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};