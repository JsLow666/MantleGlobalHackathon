import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, Calendar, User, Award } from 'lucide-react';
import { useContracts, NewsItem, VoteCounts } from '../../hooks/useContracts';
import { Verdict } from '../../utils/scoreCalculation';
import { calculateDynamicScore, DynamicScoreResult, getConfidenceColor } from '../../utils/scoreCalculation';

interface ExtendedNewsItem extends NewsItem {
  voteCounts: VoteCounts;
  verdict: Verdict;
  dynamicScore: DynamicScoreResult;
}

interface SearchFilters {
  query: string;
  verdict: Verdict | 'all';
  minVotes: number;
  maxVotes: number;
  submitter: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'newest' | 'oldest' | 'most-voted' | 'ai-score';
  sortOrder: 'asc' | 'desc';
}

const AdvancedSearch = () => {
  const { getAllNewsIds, getNews, getVoteCounts, getVerdict } = useContracts();
  const [allNews, setAllNews] = useState<ExtendedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    verdict: 'all',
    minVotes: 0,
    maxVotes: 1000,
    submitter: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchAllNews();
  }, []); // Only run once on mount

  const fetchAllNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      console.log('🔍 Starting search data fetch...', isRefresh ? '(refresh)' : '');

      const newsIds = await getAllNewsIds();
      console.log('📋 Found news IDs for search:', newsIds);

      if (newsIds.length === 0) {
        setAllNews([]);
        return;
      }

      // Add timeout and better error handling for each news item
      const newsPromises = newsIds.map(async (id) => {
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          );

          const fetchPromise = Promise.all([
            getNews(id),
            getVoteCounts(id),
            getVerdict(id)
          ]);

          const [newsItem, voteCounts, verdict] = await Promise.race([
            fetchPromise,
            timeoutPromise
          ]) as [any, VoteCounts, Verdict];

          return {
            ...newsItem,
            voteCounts,
            verdict,
            dynamicScore: calculateDynamicScore(newsItem.aiScore, voteCounts)
          } as ExtendedNewsItem;
        } catch (error) {
          console.error(`❌ Failed to fetch news item ${id}:`, error);
          return null; // Return null for failed items
        }
      });

      const newsData = (await Promise.all(newsPromises)).filter(item => item !== null) as ExtendedNewsItem[];
      console.log('✅ Search data loaded:', newsData.length, 'articles');
      setAllNews(newsData);
    } catch (error: any) {
      console.error('❌ Failed to fetch news for search:', error);
      setError(`Failed to load search data: ${error.message}`);
      setAllNews([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredAndSortedNews = useMemo(() => {
    let filtered = allNews.filter(news => {
      // Text search
      if (filters.query) {
        const searchTerm = filters.query.toLowerCase();
        const matchesTitle = news.title.toLowerCase().includes(searchTerm);
        const matchesSource = news.sourceUrl.toLowerCase().includes(searchTerm);
        if (!matchesTitle && !matchesSource) return false;
      }

      // Verdict filter
      if (filters.verdict !== 'all' && news.verdict !== filters.verdict) {
        return false;
      }

      // Vote count filter
      const totalVotes = news.voteCounts.total;
      if (totalVotes < filters.minVotes || totalVotes > filters.maxVotes) {
        return false;
      }

      // Submitter filter
      if (filters.submitter && !news.submitter.toLowerCase().includes(filters.submitter.toLowerCase())) {
        return false;
      }

      // Date filters
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime() / 1000;
        if (news.timestamp < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime() / 1000;
        if (news.timestamp > toDate) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'newest':
          comparison = b.timestamp - a.timestamp;
          break;
        case 'oldest':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'most-voted':
          comparison = b.voteCounts.total - a.voteCounts.total;
          break;
        case 'ai-score':
          comparison = b.dynamicScore.dynamicScore - a.dynamicScore.dynamicScore;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allNews, filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      verdict: 'all',
      minVotes: 0,
      maxVotes: 1000,
      submitter: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest',
      sortOrder: 'desc'
    });
  };

  const handleRefresh = () => {
    fetchAllNews(true);
  };

  const getVerdictLabel = (verdict: Verdict) => {
    switch (verdict) {
      case Verdict.Real: return 'Real';
      case Verdict.Fake: return 'Fake';
      case Verdict.Uncertain: return 'Uncertain';
      default: return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <h2 className="text-lg font-semibold text-gray-100 tracking-wide">
          <Search className="h-5 w-5 text-cyan-400"  /> Advanced Search & Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">Search</label>
            <input
              type="text"
              placeholder="Title or source URL..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Verdict */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">Verdict</label>
            <select
              value={filters.verdict}
              onChange={(e) =>
                updateFilter('verdict', e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Verdicts</option>
              <option value={Verdict.Real}>Real</option>
              <option value={Verdict.Fake}>Fake</option>
              <option value={Verdict.Uncertain}>Uncertain</option>
              <option value={Verdict.Pending}>Pending</option>
            </select>
          </div>

          {/* Min Votes */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">Min Votes</label>
            <input
              type="number"
              min="0"
              value={filters.minVotes}
              onChange={(e) => updateFilter('minVotes', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Votes */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">Max Votes</label>
            <input
              type="number"
              min="0"
              value={filters.maxVotes}
              onChange={(e) => updateFilter('maxVotes', parseInt(e.target.value) || 1000)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submitter and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">Submitter</label>
            <input
              type="text"
              placeholder="0x..."
              value={filters.submitter}
              onChange={(e) => updateFilter('submitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort & Clear */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-cyan-400 mb-1">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-voted">Most Voted</option>
              <option value="ai-score">Credibility Score</option>
            </select>
          </div>

          <button
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            <span className="text-sm">{filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>

          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Found {filteredAndSortedNews.length} article{filteredAndSortedNews.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center space-x-2 mx-auto disabled:opacity-50"
            >
              <span>{refreshing ? 'Retrying...' : 'Retry'}</span>
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading articles...</p>
          </div>
        ) : filteredAndSortedNews.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No articles match your search criteria.</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary flex items-center space-x-2 mt-4 disabled:opacity-50"
            >
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        ) : (
          filteredAndSortedNews.map((news) => (
            <div key={news.id} className="bg-black/40 backdrop-blur-xl border border-gray-700/40 rounded-xl p-5 hover:border-cyan-400/40 transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100 line-clamp-2">{news.title}</h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    news.verdict === Verdict.Real
                      ? 'bg-green-500/20 text-green-400'
                      : news.verdict === Verdict.Fake
                      ? 'bg-red-500/20 text-red-400'
                      : news.verdict === Verdict.Uncertain
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {getVerdictLabel(news.verdict)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center space-x-1">
                  <Award className={`h-4 w-4 ${getConfidenceColor(news.dynamicScore.confidence)}`} />
                  <span>Score: {news.dynamicScore.dynamicScore}/100</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{news.voteCounts.total} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(news.timestamp * 1000).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded">ID: {news.id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline text-sm truncate max-w-md"
                >
                  {news.sourceUrl}
                </a>
                <a href={`/news/${news.id}`} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  View Details →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;