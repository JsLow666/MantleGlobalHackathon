import { useState, useEffect } from 'react';
import { Vote, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  endTime: number;
  createdAt: number;
}

const GovernanceFeatures = () => {
  const { account, isVerified } = useWallet();
  const { addNotification } = useNotifications();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock proposals data - in real implementation, this would come from smart contracts
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: '1',
        title: 'Increase voting period to 7 days',
        description: 'Proposal to extend the voting period for news articles from 3 days to 7 days to allow more community participation.',
        proposer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        status: 'active',
        votesFor: 45,
        votesAgainst: 12,
        endTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
      },
      {
        id: '2',
        title: 'Add fact-checking quality requirements',
        description: 'Implement stricter requirements for fact-checkers to maintain higher quality standards.',
        proposer: '0x8ba1f109551bD432803012645ac136ddd64DBA72',
        status: 'passed',
        votesFor: 67,
        votesAgainst: 8,
        endTime: Date.now() - 1 * 24 * 60 * 60 * 1000,
        createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000
      },
      {
        id: '3',
        title: 'Reduce minimum stake for validators',
        description: 'Lower the minimum stake requirement to encourage more community validators.',
        proposer: '0x1234567890123456789012345678901234567890',
        status: 'rejected',
        votesFor: 23,
        votesAgainst: 52,
        endTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000
      }
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
    if (!account) {
      addNotification({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to vote'
      });
      return;
    }

    if (!isVerified) {
      addNotification({
        type: 'warning',
        title: 'Verification Required',
        message: 'ZK verification required to vote on proposals'
      });
      return;
    }

    // Mock voting logic
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          votesFor: voteType === 'for' ? proposal.votesFor + 1 : proposal.votesFor,
          votesAgainst: voteType === 'against' ? proposal.votesAgainst + 1 : proposal.votesAgainst
        };
      }
      return proposal;
    }));

    addNotification({
      type: 'success',
      title: 'Vote Recorded',
      message: `Vote ${voteType === 'for' ? 'for' : 'against'} proposal recorded`
    });
  };

  const handleCreateProposal = () => {
    if (!account) {
      addNotification({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to create proposals'
      });
      return;
    }

    if (!isVerified) {
      addNotification({
        type: 'warning',
        title: 'Verification Required',
        message: 'ZK verification required to create proposals'
      });
      return;
    }

    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all fields'
      });
      return;
    }

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      proposer: account,
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      endTime: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
      createdAt: Date.now()
    };

    setProposals(prev => [proposal, ...prev]);
    setNewProposal({ title: '', description: '' });
    setShowCreateForm(false);
    addNotification({
      type: 'success',
      title: 'Proposal Created',
      message: 'Proposal created successfully'
    });
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'passed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'executed': return 'text-purple-600 bg-purple-100';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
    }
  };

  const formatTimeLeft = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
  <div className="space-y-8">
    {/* Header */}
    <div className="bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6
                    shadow-[0_0_30px_rgba(168,85,247,0.12)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Vote className="h-9 w-9 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Governance
            </h2>
            <p className="text-gray-400 text-sm">
              Decentralized proposals & on-chain decision making
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl
                     bg-gradient-to-r from-purple-600 to-cyan-600
                     text-black font-semibold
                     hover:from-purple-500 hover:to-cyan-500
                     shadow-[0_0_20px_rgba(34,211,238,0.35)]
                     transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create Proposal</span>
        </button>
      </div>
    </div>

    {/* Create Proposal Form */}
    {showCreateForm && (
      <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6
                      shadow-[0_0_30px_rgba(34,211,238,0.12)]">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Create New Proposal
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            value={newProposal.title}
            onChange={(e) =>
              setNewProposal(prev => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-2 bg-black border border-purple-500/30 rounded-xl
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Proposal title"
          />

          <textarea
            value={newProposal.description}
            onChange={(e) =>
              setNewProposal(prev => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-2 bg-black border border-purple-500/30 rounded-xl
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your proposal"
          />

          <div className="flex space-x-3">
            <button
              onClick={handleCreateProposal}
              className="px-5 py-2 rounded-xl bg-green-500/90 text-black font-semibold
                         hover:bg-green-400 transition"
            >
              Submit
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-5 py-2 rounded-xl bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Proposals List */}
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className="bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6
                     shadow-[0_0_25px_rgba(168,85,247,0.1)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-1">
                {proposal.title}
              </h3>
              <p className="text-gray-400 mb-2">{proposal.description}</p>
              <p className="text-xs text-gray-500">
                {proposal.proposer.slice(0, 6)}…{proposal.proposer.slice(-4)} •{" "}
                {new Date(proposal.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(proposal.status)}`}>
              {getStatusIcon(proposal.status)}
              <span className="ml-1 capitalize">{proposal.status}</span>
            </div>
          </div>

          {/* Voting Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-400">{proposal.votesFor}</div>
              <div className="text-xs text-green-300">FOR</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-red-400">{proposal.votesAgainst}</div>
              <div className="text-xs text-red-300">AGAINST</div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3">
              <div className="text-lg font-bold text-cyan-400">
                {proposal.status === 'active'
                  ? formatTimeLeft(proposal.endTime)
                  : 'Ended'}
              </div>
              <div className="text-xs text-cyan-300">TIME</div>
            </div>
          </div>

          {/* Voting Actions */}
          {proposal.status === 'active' && (
            <div className="flex space-x-3">
              <button
                onClick={() => handleVote(proposal.id, 'for')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl
                           bg-green-500/90 text-black font-semibold hover:bg-green-400"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Vote For</span>
              </button>

              <button
                onClick={() => handleVote(proposal.id, 'against')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl
                           bg-red-500/90 text-black font-semibold hover:bg-red-400"
              >
                <XCircle className="h-4 w-4" />
                <span>Vote Against</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Empty State */}
    {proposals.length === 0 && (
      <div className="bg-black/60 border border-purple-500/20 rounded-2xl p-10 text-center">
        <Vote className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <p className="text-gray-400">
          No proposals yet. Initiate governance.
        </p>
      </div>
    )}
  </div>
);
};

export default GovernanceFeatures;