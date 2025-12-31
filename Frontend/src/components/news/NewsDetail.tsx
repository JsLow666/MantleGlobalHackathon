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
        consensusResult: consensusResult || undefined,
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 pr-4">{news.title}</h1>
          <VerdictBadge verdict={news.verdict} />
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-md p-4">
            {news.fullContent ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.fullContent}
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Full article content is not available.</p>
                <p className="text-sm mt-1">Content may have been submitted before this feature was implemented.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-lg font-semibold text-blue-800">
                  Credibility Score: {news.dynamicScore.dynamicScore}/100
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  AI: {news.dynamicScore.aiScore}/100 • Community: {news.dynamicScore.communityScore}/100
                </p>
                <p className={`text-xs mt-1 font-medium ${getConfidenceColor(news.dynamicScore.confidence)}`}>
                  {getConfidenceLabel(news.dynamicScore.confidence)}
                </p>
              </div>
              <p><strong>Submitted by:</strong> {news.submitter}</p>
              <p><strong>Submitted on:</strong> {formatTimestamp(news.timestamp)}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-800">Community Votes</p>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-600">Real: {news.voteCounts.real}</span>
                  <span className="text-red-600">Fake: {news.voteCounts.fake}</span>
                  <span className="text-yellow-600">Uncertain: {news.voteCounts.uncertain}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total votes: {news.voteCounts.total}</p>
              </div>
              <p><strong>Source:</strong> <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{news.sourceUrl}</a></p>
              <p><strong>News ID:</strong> #{news.id}</p>
            </div>
          </div>
        </div>

        <VotePanel newsId={news.id} />
      </div>
    </div>
  );
};

export default NewsDetail;