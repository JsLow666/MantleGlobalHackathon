import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useContracts, VoteType } from '../../hooks/useContracts';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { useNotifications } from '../../contexts/NotificationContext';

interface VotePanelProps {
  newsId: number;
}

const VotePanel = ({ newsId }: VotePanelProps) => {
  const { account, isVerified } = useWallet();
  const { castVote, getMyVote, haveIVoted } = useContracts();
  const { onVoteUpdate } = useRealTimeUpdates();
  const { addNotification } = useNotifications();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!account) {
        setLoading(false);
        return;
      }

      try {
        const [voted, vote] = await Promise.all([
          haveIVoted(newsId),
          getMyVote(newsId)
        ]);
        setHasVoted(voted);
        setUserVote(vote === VoteType.None ? null : vote);
      } catch (error) {
        console.error('Failed to fetch vote status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteStatus();
  }, [account, newsId, haveIVoted, getMyVote]);

  // Set up real-time listener for vote updates on this news item
  useEffect(() => {
    const unsubscribe = onVoteUpdate((eventNewsId, voter) => {
      if (eventNewsId === newsId && voter === account) {
        console.log('🗳️ Vote update for current user detected, refreshing vote status...');
        // Refresh vote status
        const refreshVoteStatus = async () => {
          try {
            const [voted, vote] = await Promise.all([
              haveIVoted(newsId),
              getMyVote(newsId)
            ]);
            setHasVoted(voted);
            setUserVote(vote === VoteType.None ? null : vote);
          } catch (error) {
            console.error('Failed to refresh vote status:', error);
          }
        };
        refreshVoteStatus();
      }
    });

    return unsubscribe;
  }, [newsId, account, onVoteUpdate, haveIVoted, getMyVote]);

  const handleVote = async (voteType: VoteType) => {
    if (!account) {
      alert('Please connect your wallet to vote');
      return;
    }

    if (!isVerified) {
      alert('Please verify your identity with ZK proof before voting');
      return;
    }

    setIsVoting(true);
    try {
      console.log('🗳️ Casting vote for news ID:', newsId, 'Vote type:', voteType);
      await castVote(newsId, voteType);
      setHasVoted(true);
      setUserVote(voteType);
      console.log('✅ Vote cast successfully');

      // Show success notification
      const voteTypeLabel = voteType === VoteType.Real ? 'Real' :
                           voteType === VoteType.Fake ? 'Fake' : 'Uncertain';
      addNotification({
        type: 'success',
        title: 'Vote Cast Successfully',
        message: `You voted "${voteTypeLabel}" on this news article`,
        autoHide: true,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('❌ Voting failed:', error);
      addNotification({
        type: 'error',
        title: 'Voting Failed',
        message: error.message || 'Failed to cast vote',
        autoHide: true,
        duration: 5000,
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getVoteLabel = (vote: VoteType | null) => {
    switch (vote) {
      case VoteType.Real: return 'Real';
      case VoteType.Fake: return 'Fake';
      case VoteType.Uncertain: return 'Uncertain';
      default: return null;
    }
  };

  const getVoteColor = (vote: VoteType | null) => {
    switch (vote) {
      case VoteType.Real: return 'text-green-600';
      case VoteType.Fake: return 'text-red-600';
      case VoteType.Uncertain: return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Loading vote status...</span>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <span>Connect your wallet to vote on this news.</span>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
        <div className="flex items-center space-x-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          <span>Verify your identity with ZK proof to vote.</span>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <p className="text-sm text-gray-600 mb-2">
          Your vote: <strong className={getVoteColor(userVote)}>{getVoteLabel(userVote)}</strong>
        </p>
        <p className="text-xs text-gray-500">You can only vote once per news item.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      <h3 className="font-medium text-gray-900 mb-3">Cast your vote on this news:</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleVote(VoteType.Real)}
          disabled={isVoting}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isVoting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className="h-4 w-4" />
          )}
          <span>Real</span>
        </button>

        <button
          onClick={() => handleVote(VoteType.Fake)}
          disabled={isVoting}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isVoting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ThumbsDown className="h-4 w-4" />
          )}
          <span>Fake</span>
        </button>

        <button
          onClick={() => handleVote(VoteType.Uncertain)}
          disabled={isVoting}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isVoting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <HelpCircle className="h-4 w-4" />
          )}
          <span>Uncertain</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Your vote will be recorded on the blockchain and contribute to the community consensus.
      </p>
    </div>
  );
};

export default VotePanel;