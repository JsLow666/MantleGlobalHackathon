import { useState, useEffect } from 'react';
import { User, Award, TrendingUp, Vote, CheckCircle, Clock, Target } from 'lucide-react';
import { ethers } from 'ethers';
import { useWallet } from '@/contexts/WalletContext';
import { useContracts, VoteType } from '@/hooks/useContracts';

interface UserStats {
  totalVotes: number;
  realVotes: number;
  fakeVotes: number;
  uncertainVotes: number;
  articlesSubmitted: number;
  reputation: number;
  accuracy: number;
  rank: string;
  joinDate: number;
  lastActivity: number;
}

const UserProfile = () => {
  const { account, isVerified } = useWallet();
  const { getAllNewsIds, getNews, haveIVoted, getMyVote, verifyAndRegister } = useContracts();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get all news IDs to analyze user's activity
        const newsIds = await getAllNewsIds();

        let totalVotes = 0;
        let realVotes = 0;
        let fakeVotes = 0;
        let uncertainVotes = 0;
        let articlesSubmitted = 0;
        let earliestActivity = Date.now();

        // Analyze each article for user activity
        for (const newsId of newsIds) {
          const [newsItem, hasVoted, userVote] = await Promise.all([
            getNews(newsId),
            haveIVoted(newsId),
            getMyVote(newsId)
          ]);

          // Count submitted articles
          if (newsItem.submitter.toLowerCase() === account.toLowerCase()) {
            articlesSubmitted++;
            if (newsItem.timestamp * 1000 < earliestActivity) {
              earliestActivity = newsItem.timestamp * 1000;
            }
          }

          // Count votes
          if (hasVoted) {
            totalVotes++;
            switch (userVote) {
              case VoteType.Real:
                realVotes++;
                break;
              case VoteType.Fake:
                fakeVotes++;
                break;
              case VoteType.Uncertain:
                uncertainVotes++;
                break;
            }
          }
        }

        // Calculate reputation and accuracy (mock calculations)
        const reputation = Math.min(100, totalVotes * 2 + articlesSubmitted * 5);
        const accuracy = totalVotes > 0 ? Math.floor(75 + Math.random() * 20) : 0; // Mock accuracy

        // Determine rank based on reputation
        let rank = 'Novice';
        if (reputation >= 90) rank = 'Expert Validator';
        else if (reputation >= 70) rank = 'Trusted Validator';
        else if (reputation >= 50) rank = 'Active Contributor';
        else if (reputation >= 25) rank = 'Community Member';

        const userStats: UserStats = {
          totalVotes,
          realVotes,
          fakeVotes,
          uncertainVotes,
          articlesSubmitted,
          reputation,
          accuracy,
          rank,
          joinDate: earliestActivity,
          lastActivity: Date.now() // Mock last activity
        };

        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [account, getAllNewsIds, getNews, haveIVoted, getMyVote]);

  const getReputationColor = (reputation: number) => {
    if (reputation >= 80) return 'text-green-600';
    if (reputation >= 60) return 'text-blue-600';
    if (reputation >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Expert Validator':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'Trusted Validator':
        return <Award className="h-5 w-5 text-blue-500" />;
      case 'Active Contributor':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
            <p className="text-gray-600 font-mono text-sm">{account}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getRankIcon(stats.rank)}
              <span className="text-sm font-medium text-gray-700">{stats.rank}</span>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isVerified
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isVerified ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>ZK Verified</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>Verification Required</span>
              </>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.totalVotes}</div>
            <div className="text-sm text-gray-600">Total Votes</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.articlesSubmitted}</div>
            <div className="text-sm text-gray-600">Articles Submitted</div>
          </div>

          <div className={`text-center p-4 bg-gray-50 rounded-lg`}>
            <div className={`text-2xl font-bold ${getReputationColor(stats.reputation)}`}>
              {stats.reputation}
            </div>
            <div className="text-sm text-gray-600">Reputation Score</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Activity</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-800">{stats.realVotes}</div>
              <div className="text-sm text-green-600">Real Votes</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Vote className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-red-800">{stats.fakeVotes}</div>
              <div className="text-sm text-red-600">Fake Votes</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-semibold text-yellow-800">{stats.uncertainVotes}</div>
              <div className="text-sm text-yellow-600">Uncertain Votes</div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Activity Summary</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Member since:</span>
              <span>{new Date(stats.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last activity:</span>
              <span>{new Date(stats.lastActivity).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Voting streak:</span>
              <span>12 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.totalVotes >= 10 && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">First Steps</div>
                <div className="text-sm text-blue-600">Cast 10 votes</div>
              </div>
            </div>
          )}

          {stats.articlesSubmitted >= 1 && (
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Content Creator</div>
                <div className="text-sm text-green-600">Submit your first article</div>
              </div>
            </div>
          )}

          {stats.reputation >= 50 && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800">Trusted Member</div>
                <div className="text-sm text-purple-600">Reach 50 reputation points</div>
              </div>
            </div>
          )}

          {stats.accuracy >= 85 && (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-800">Accuracy Expert</div>
                <div className="text-sm text-yellow-600">Maintain 85%+ accuracy</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;