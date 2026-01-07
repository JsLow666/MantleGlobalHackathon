import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useContracts, NewsItem, VoteCounts } from '../../hooks/useContracts';
import { Verdict } from '../../utils/scoreCalculation';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { apiService } from '../../services/api';
import { calculateDynamicScore, DynamicScoreResult, getConfidenceColor, getConfidenceLabel } from '../../utils/scoreCalculation';
import VerdictBadge from '../voting/VerdictBadge';
import VotePanel from '../voting/VotePanel';

interface NewsDetailProps {
  newsId: number;
}

interface ExtendedNewsItem extends NewsItem {
  voteCounts: VoteCounts;
  verdict: Verdict;
  consensusResult?: {
    aiScore: number;
    communityScore: number;
    finalScore: number;
    confidence: number;
    finalized: boolean;
  };
  fullContent?: string; // Add full content field
  dynamicScore: DynamicScoreResult; // Add dynamic score calculation
}

const NewsDetail = ({ newsId }: NewsDetailProps) => {
  const { getNews, getVoteCounts, getVerdict, getConsensusResult } = useContracts();
  const { onVoteUpdate, onVerdictUpdate } = useRealTimeUpdates();
  const [news, setNews] = useState<ExtendedNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNewsDetail = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📡 Fetching news detail for ID:', newsId, isRefresh ? '(refresh)' : '');

      // Fetch all data in parallel
      const [newsItem, voteCounts, verdict, consensusResult] = await Promise.all([
        getNews(newsId),
        getVoteCounts(newsId),
        getVerdict(newsId),
        getConsensusResult(newsId).catch(() => null) // Consensus might not exist yet
      ]);

      // Fetch full content from API
      let fullContent: string | undefined;
      try {
        const contentResponse = await apiService.getContentByHash(newsItem.contentHash);
        fullContent = contentResponse.content;
        console.log('📖 Full content retrieved for news ID:', newsId);
      } catch (contentError) {
        console.warn('⚠️ Could not retrieve full content:', contentError);
        fullContent = undefined; // Content not available
      }

      const extendedItem: ExtendedNewsItem = {
        ...newsItem,
        voteCounts,
        verdict,
        // consensusResult: consensusResult || undefined,
        fullContent,
        dynamicScore: calculateDynamicScore(newsItem.aiScore, voteCounts),
      };

      setNews(extendedItem);
      console.log('✅ News detail loaded:', extendedItem);

    } catch (error: any) {
      console.error('❌ Failed to load news detail:', error);
      setError(`Failed to load news: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [newsId]); // Remove function dependencies to prevent re-creation

  useEffect(() => {
    if (newsId) {
      fetchNewsDetail();
    }
  }, [newsId]); // Only depend on newsId, not fetchNewsDetail

  // Set up real-time listeners for this specific news item
  useEffect(() => {
    if (!newsId) return;

    const unsubscribeVote = onVoteUpdate((eventNewsId) => {
      if (eventNewsId === newsId) {
        console.log('🗳️ Vote event for current news detected, refreshing...');
        fetchNewsDetail(true);
      }
    });

    const unsubscribeVerdict = onVerdictUpdate((eventNewsId) => {
      if (eventNewsId === newsId) {
        console.log('⚖️ Verdict event for current news detected, refreshing...');
        fetchNewsDetail(true);
      }
    });

    return () => {
      unsubscribeVote();
      unsubscribeVerdict();
    };
  }, [newsId, onVoteUpdate, onVerdictUpdate]); // Remove fetchNewsDetail dependency

  const handleRefresh = () => {
    fetchNewsDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading news...</span>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center space-x-2 text-red-800 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span>{error || 'News not found'}</span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={handleRefresh}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-600 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        {/* Title & Verdict */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white pr-4 break-words">
            {news.title}
          </h1>
          <VerdictBadge verdict={news.verdict} />
        </div>

        {/* Full Content */}
        <div className="bg-gray-700 rounded-xl p-6 mb-6 shadow-inner">
          {news.fullContent ? (
            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {news.fullContent}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-400 italic">Full article content is not available.</p>
              <p className="text-sm mt-1 text-gray-500">
                Content may have been submitted before this feature was implemented.
              </p>
            </div>
          )}
        </div>

        {/* Scores & Metadata */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 text-gray-200">
          {/* AI + Community Score */}
          <div className="space-y-3">
            <div className="bg-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
              <p className="text-lg font-semibold text-blue-400">
                Credibility Score: {news.dynamicScore.dynamicScore}/100
              </p>
              <p className="text-xs text-blue-300 mt-1">
                AI: {news.dynamicScore.aiScore}/100 • Community: {news.dynamicScore.communityScore}/100
              </p>
              <p className={`text-xs mt-1 font-medium ${getConfidenceColor(news.dynamicScore.confidence)}`}>
                {getConfidenceLabel(news.dynamicScore.confidence)}
              </p>
            </div>
            <p><strong>Submitted by:</strong> {news.submitter}</p>
            <p><strong>Submitted on:</strong> {formatTimestamp(news.timestamp)}</p>
          </div>

          {/* Community Votes + Info */}
          <div className="space-y-3">
            <div className="bg-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
              <p className="text-sm font-medium text-gray-200">Community Votes</p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-green-400">Real: {news.voteCounts.real}</span>
                <span className="text-red-400">Fake: {news.voteCounts.fake}</span>
                <span className="text-yellow-400">Uncertain: {news.voteCounts.uncertain}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Total votes: {news.voteCounts.total}</p>
            </div>
            <p>
              <strong>Source:</strong>{" "}
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {news.sourceUrl}
              </a>
            </p>
            <p><strong>News ID:</strong> #{news.id}</p>
          </div>
        </div>

        {/* Voting Panel */}
        <VotePanel newsId={news.id} />
      </div>
    </div>
  );
};

export default NewsDetail;
