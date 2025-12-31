import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useContracts, NewsItem, VoteCounts } from '../../hooks/useContracts';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { Verdict, calculateDynamicScore, DynamicScoreResult } from '../../utils/scoreCalculation';
import NewsCard from './NewsCard';

interface ExtendedNewsItem extends NewsItem {
  voteCounts: VoteCounts;
  verdict: Verdict;
  dynamicScore: DynamicScoreResult;
}

const NewsList = () => {
  const { getAllNewsIds, getNews, getVoteCounts, getVerdict } = useContracts();
  const { onVoteUpdate, onVerdictUpdate, onNewsUpdate } = useRealTimeUpdates();
  const [news, setNews] = useState<ExtendedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📡 Fetching news from blockchain...', isRefresh ? '(refresh)' : '');

      // Get all news IDs
      const newsIds = await getAllNewsIds();
      console.log('📋 Found news IDs:', newsIds);

      if (newsIds.length === 0) {
        setNews([]);
        return;
      }

      // Fetch details for each news item including votes and verdict
      const newsPromises = newsIds.map(async (id) => {
        try {
          const [newsItem, voteCountsResult, verdictResult] = await Promise.allSettled([
            getNews(id),
            getVoteCounts(id),
            getVerdict(id)
          ]);

          // Check if news item was successfully fetched
          if (newsItem.status === 'rejected') {
            console.error(`❌ Failed to fetch news item ${id}:`, newsItem.reason);
            return null;
          }

          const voteCounts = voteCountsResult.status === 'fulfilled' 
            ? voteCountsResult.value 
            : { real: 0, fake: 0, uncertain: 0, total: 0 };

          const verdict = verdictResult.status === 'fulfilled' 
            ? verdictResult.value 
            : Verdict.Pending;

          const extendedItem: ExtendedNewsItem = {
            ...newsItem.value,
            voteCounts,
            verdict,
            dynamicScore: calculateDynamicScore(newsItem.value.aiScore, voteCounts),
          };
          return extendedItem;
        } catch (error) {
          console.error(`❌ Failed to fetch news item ${id}:`, error);
          return null;
        }
      });

      const newsData = (await Promise.all(newsPromises)).filter(item => item !== null) as ExtendedNewsItem[];

      // Sort by timestamp (newest first)
      newsData.sort((a, b) => b.timestamp - a.timestamp);

      setNews(newsData);

    } catch (error: any) {
      console.error('❌ Failed to load news:', error);
      setError(`Failed to load news: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Remove dependencies to prevent re-creation

  useEffect(() => {
    fetchNews();
  }, []); // Only run once on mount

  // Set up real-time listeners
  useEffect(() => {
    const unsubscribeVote = onVoteUpdate(() => {
      console.log('🗳️ Vote event detected, refreshing news list...');
      fetchNews(true);
    });

    const unsubscribeVerdict = onVerdictUpdate(() => {
      console.log('⚖️ Verdict event detected, refreshing news list...');
      fetchNews(true);
    });

    const unsubscribeNews = onNewsUpdate(() => {
      console.log('📰 News event detected, refreshing news list...');
      fetchNews(true);
    });

    return () => {
      unsubscribeVote();
      unsubscribeVerdict();
      unsubscribeNews();
    };
  }, []); // Remove fetchNews dependency to prevent issues // Only run once on mount

  const handleRefresh = () => {
    fetchNews(true);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="flex items-center space-x-2 text-red-800 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No News Yet</h2>
        <p className="text-gray-600 mb-6">
          Be the first to submit news for validation! Connect your wallet and submit an article.
        </p>
        <button
          onClick={handleRefresh}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {news.length} article{news.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            sourceUrl={item.sourceUrl}
            aiScore={item.aiScore}
            dynamicScore={item.dynamicScore}
            submitter={`${item.submitter.slice(0, 6)}...${item.submitter.slice(-4)}`}
            voteCounts={item.voteCounts}
            verdict={item.verdict}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsList;