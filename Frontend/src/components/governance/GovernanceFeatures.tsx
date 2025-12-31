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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Vote className="h-8 w-8 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Governance</h2>
              <p className="text-gray-600">Participate in platform governance and decision making</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Proposal</span>
          </button>
        </div>
      </div>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Proposal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter proposal title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your proposal in detail"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateProposal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Proposal
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {proposal.title}
                </h3>
                <p className="text-gray-600 mb-3">{proposal.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
                  <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                {getStatusIcon(proposal.status)}
                <span className="capitalize">{proposal.status}</span>
              </div>
            </div>

            {/* Voting Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{proposal.votesFor}</div>
                <div className="text-sm text-green-600">Votes For</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{proposal.votesAgainst}</div>
                <div className="text-sm text-red-600">Votes Against</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {proposal.status === 'active' ? formatTimeLeft(proposal.endTime) : 'Ended'}
                </div>
                <div className="text-sm text-blue-600">Time Left</div>
              </div>
            </div>

            {/* Voting Actions */}
            {proposal.status === 'active' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVote(proposal.id, 'for')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Vote For</span>
                </button>
                <button
                  onClick={() => handleVote(proposal.id, 'against')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Vote Against</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {proposals.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No proposals yet. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
};

export default GovernanceFeatures;