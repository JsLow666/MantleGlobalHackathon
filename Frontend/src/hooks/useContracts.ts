import { useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import {
  CONTRACT_ADDRESSES,
  NEWS_REGISTRY_ABI,
  ZK_VERIFIER_ABI,
  VOTE_MANAGER_ABI
} from '../config/contracts';
import { calculateConsensus, Verdict, ConsensusResult } from '../utils/scoreCalculation';

export interface NewsItem {
  id: number;
  contentHash: string;
  aiScore: number;
  submitter: string;
  submitterZkHash: string;
  timestamp: number;
  title: string;
  sourceUrl: string;
  exists: boolean;
}

export interface VoteCounts {
  real: number;
  fake: number;
  uncertain: number;
  total: number;
}

export interface VotePercentages {
  realPercent: number;
  fakePercent: number;
  uncertainPercent: number;
}

export enum VoteType {
  None = 0,
  Real = 1,
  Fake = 2,
  Uncertain = 3,
}

export const useContracts = () => {
  const { provider, signer, account } = useWallet();

  // Create contract instances
  const contracts = useMemo(() => {
    if (!provider) return null;

    return {
      newsRegistry: new ethers.Contract(
        CONTRACT_ADDRESSES.NewsRegistry,
        NEWS_REGISTRY_ABI,
        signer || provider // Use signer if available, otherwise provider for read-only
      ),
      zkVerifier: new ethers.Contract(
        CONTRACT_ADDRESSES.ZKVerifier,
        ZK_VERIFIER_ABI,
        signer || provider
      ),
      voteManager: new ethers.Contract(
        CONTRACT_ADDRESSES.VoteManager,
        VOTE_MANAGER_ABI,
        signer || provider
      ),
    };
  }, [provider, signer]);

  // News Registry functions
  const submitNews = async (
    contentHash: string,
    title: string,
    sourceUrl: string,
    aiScore: number
  ): Promise<number> => {
    if (!contracts || !signer || !account) {
      throw new Error('Wallet not connected');
    }

    console.log('📝 Submitting news to blockchain...', {
      contentHash,
      title,
      sourceUrl,
      aiScore,
      submitter: account
    });

    try {
      const tx = await contracts.newsRegistry.submitNews(
        contentHash,
        title,
        sourceUrl,
        aiScore
      );

      console.log('⏳ Transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);

      // Extract news ID from event logs
      const event = receipt.logs.find(
        (log: any) => log.eventName === 'NewsSubmitted'
      );

      if (event) {
        const newsId = event.args.newsId;
        console.log('🎉 News submitted successfully! ID:', newsId);
        return Number(newsId);
      }

      throw new Error('News ID not found in transaction logs');
    } catch (error: any) {
      console.error('❌ Failed to submit news:', error);
      throw new Error(`Failed to submit news: ${error.message}`);
    }
  };

  const getNews = async (newsId: number): Promise<NewsItem> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      const news = await contracts.newsRegistry.getNews(newsId);
      return {
        id: Number(news.id),
        contentHash: news.contentHash,
        aiScore: Number(news.aiScore),
        submitter: news.submitter,
        submitterZkHash: news.submitterZkHash,
        timestamp: Number(news.timestamp),
        title: news.title,
        sourceUrl: news.sourceUrl,
        exists: news.exists,
      };
    } catch (error: any) {
      console.error('❌ Failed to get news:', error);
      throw new Error(`Failed to get news: ${error.message}`);
    }
  };

  const getAllNewsIds = async (): Promise<number[]> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      // Get total news count
      const totalCount = await contracts.newsRegistry.newsCount();
      const count = Number(totalCount);

      if (count === 0) {
        return [];
      }

      // Get the latest 50 news IDs (or all if less than 50)
      const limit = Math.min(50, count);
      const startId = count - limit + 1;

      // Create array of IDs from startId to count
      const ids: number[] = [];
      for (let i = startId; i <= count; i++) {
        ids.push(i);
      }

      return ids.reverse(); // Return newest first
    } catch (error: any) {
      console.error('❌ Failed to get all news IDs:', error);
      throw new Error(`Failed to get all news IDs: ${error.message}`);
    }
  };

  const getNewsCount = async (): Promise<number> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      const count = await contracts.newsRegistry.newsCount();
      return Number(count);
    } catch (error: any) {
      console.error('❌ Failed to get news count:', error);
      throw new Error(`Failed to get news count: ${error.message}`);
    }
  };

  // ZK Verifier functions
  const getZkHash = async (userAddress: string): Promise<string> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      return await contracts.zkVerifier.getZkHash(userAddress);
    } catch (error: any) {
      console.error('❌ Failed to get ZK hash:', error);
      throw new Error(`Failed to get ZK hash: ${error.message}`);
    }
  };

  const isVerified = async (zkHash: string): Promise<boolean> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      return await contracts.zkVerifier.isVerified(zkHash);
    } catch (error: any) {
      console.error('❌ Failed to check verification:', error);
      throw new Error(`Failed to check verification: ${error.message}`);
    }
  };

  const verifyAndRegister = async (zkHash: string, proof: string): Promise<void> => {
    if (!contracts || !signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await contracts.zkVerifier.verifyAndRegister(zkHash, proof);
      await tx.wait();
      console.log('✅ User verified and registered on blockchain');
    } catch (error: any) {
      console.error('❌ Failed to verify and register:', error);
      throw new Error(`Failed to verify and register: ${error.message}`);
    }
  };

  // Vote Manager functions
  const castVote = async (newsId: number, voteType: VoteType): Promise<void> => {
    if (!contracts || !signer || !account) {
      throw new Error('Wallet not connected');
    }

    console.log('🗳️ Casting vote...', {
      newsId,
      voteType,
      voter: account
    });

    try {
      const tx = await contracts.voteManager.castVote(newsId, voteType);
      console.log('⏳ Vote transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Vote cast successfully:', receipt.hash);
    } catch (error: any) {
      console.error('❌ Failed to cast vote:', error);
      throw new Error(`Failed to cast vote: ${error.message}`);
    }
  };

  const getVoteCounts = async (newsId: number): Promise<VoteCounts> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      const counts = await contracts.voteManager.getVoteCounts(newsId);
      return {
        real: Number(counts.real),
        fake: Number(counts.fake),
        uncertain: Number(counts.uncertain),
        total: Number(counts.total),
      };
    } catch (error: any) {
      console.error('❌ Failed to get vote counts:', error);
      throw new Error(`Failed to get vote counts: ${error.message}`);
    }
  };

  const getVotePercentages = async (newsId: number): Promise<VotePercentages> => {
    if (!contracts) {
      throw new Error('Contracts not initialized');
    }

    try {
      const percentages = await contracts.voteManager.getVotePercentages(newsId);
      return {
        realPercent: Number(percentages.realPercent),
        fakePercent: Number(percentages.fakePercent),
        uncertainPercent: Number(percentages.uncertainPercent),
      };
    } catch (error: any) {
      console.error('❌ Failed to get vote percentages:', error);
      throw new Error(`Failed to get vote percentages: ${error.message}`);
    }
  };

  const getMyVote = async (newsId: number): Promise<VoteType> => {
    if (!contracts || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const vote = await contracts.voteManager.getMyVote(newsId);
      return Number(vote) as VoteType;
    } catch (error: any) {
      console.error('❌ Failed to get my vote:', error);
      throw new Error(`Failed to get my vote: ${error.message}`);
    }
  };

  const haveIVoted = async (newsId: number): Promise<boolean> => {
    if (!contracts || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      return await contracts.voteManager.haveIVoted(newsId);
    } catch (error: any) {
      console.error('❌ Failed to check if voted:', error);
      throw new Error(`Failed to check if voted: ${error.message}`);
    }
  };

  // Consensus functions (calculated client-side)
  const getVerdict = async (newsId: number): Promise<Verdict> => {
    try {
      const [newsItem, voteCounts] = await Promise.all([
        getNews(newsId),
        getVoteCounts(newsId)
      ]);

      const consensus = calculateConsensus(newsItem.aiScore, voteCounts);
      return consensus.verdict;
    } catch (error: any) {
      console.error('❌ Failed to get verdict:', error);
      throw new Error(`Failed to get verdict: ${error.message}`);
    }
  };

  const getConsensusResult = async (newsId: number): Promise<ConsensusResult> => {
    try {
      const [newsItem, voteCounts] = await Promise.all([
        getNews(newsId),
        getVoteCounts(newsId)
      ]);

      const consensus = calculateConsensus(newsItem.aiScore, voteCounts);
      return consensus;
    } catch (error: any) {
      console.error('❌ Failed to get consensus result:', error);
      throw new Error(`Failed to get consensus result: ${error.message}`);
    }
  };

  const isFinalized = async (newsId: number): Promise<boolean> => {
    try {
      const [newsItem, voteCounts] = await Promise.all([
        getNews(newsId),
        getVoteCounts(newsId)
      ]);

      const consensus = calculateConsensus(newsItem.aiScore, voteCounts);
      return consensus.isFinalized;
    } catch (error: any) {
      console.error('❌ Failed to check if finalized:', error);
      throw new Error(`Failed to check if finalized: ${error.message}`);
    }
  };

  // Event listeners for real-time updates
  const onVoteCast = useCallback((callback: (newsId: number, voter: string, voteType: VoteType, timestamp: number) => void) => {
    if (!contracts) return () => {};

    const filter = contracts.voteManager.filters.VoteCast();
    const listener = (newsId: any, voter: any, voteType: any, timestamp: any) => {
      callback(
        Number(newsId),
        voter,
        Number(voteType) as VoteType,
        Number(timestamp)
      );
    };

    contracts.voteManager.on(filter, listener);
    return () => contracts.voteManager.off(filter, listener);
  }, [contracts]);

  const onVerdictCalculated = useCallback((callback: (newsId: number, verdict: Verdict, finalScore: number, confidence: number, timestamp: number) => void) => {
    // Consensus is now calculated client-side, so we trigger on vote events instead
    return onVoteCast((newsId, _voter, _voteType, _timestamp) => {
      // When a vote is cast, the consensus may change, so we recalculate it
      getConsensusResult(newsId).then(consensus => {
        callback(newsId, consensus.verdict, consensus.finalScore, consensus.confidence, Date.now());
      }).catch(error => {
        console.error('Failed to recalculate consensus after vote:', error);
      });
    });
  }, [onVoteCast, getConsensusResult]);

  const onNewsSubmitted = useCallback((callback: (newsId: number, contentHash: string, submitter: string, aiScore: number, timestamp: number) => void) => {
    if (!contracts) return () => {};

    const filter = contracts.newsRegistry.filters.NewsSubmitted();
    const listener = (newsId: any, contentHash: any, submitter: any, aiScore: any, timestamp: any) => {
      callback(
        Number(newsId),
        contentHash,
        submitter,
        Number(aiScore),
        Number(timestamp)
      );
    };

    contracts.newsRegistry.on(filter, listener);
    return () => contracts.newsRegistry.off(filter, listener);
  }, [contracts]);

  return {
    contracts,
    submitNews,
    getNews,
    getAllNewsIds,
    getNewsCount,
    getZkHash,
    isVerified,
    verifyAndRegister,
    castVote,
    getVoteCounts,
    getVotePercentages,
    getMyVote,
    haveIVoted,
    getVerdict,
    getConsensusResult,
    isFinalized,
    onVoteCast,
    onVerdictCalculated,
    onNewsSubmitted,
  };
};