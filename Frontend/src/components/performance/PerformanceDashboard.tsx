import { useState, useEffect } from 'react';
import { Activity, Database, Zap, Trash2, RefreshCw, BarChart3 } from 'lucide-react';
import {
  getMemoryUsage,
  getCacheStats,
  clearAllCaches,
  newsCache,
  userStatsCache
} from '../../utils/performance';

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
  cache: {
    newsCache: number;
    userStatsCache: number;
  };
  timing: {
    pageLoad: number;
    firstPaint: number;
    largestContentfulPaint: number;
  };
}

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);

    const memory = getMemoryUsage();
    const cache = getCacheStats();

    // Get performance timing data
    const timing = {
      pageLoad: performance.getEntriesByType('navigation')[0] ?
        (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).loadEventEnd -
        (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).fetchStart : 0,
      firstPaint: performance.getEntriesByName('first-paint')[0] ?
        (performance.getEntriesByName('first-paint')[0] as PerformanceEntry).startTime : 0,
      largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0] ?
        (performance.getEntriesByName('largest-contentful-paint')[0] as PerformanceEntry).startTime : 0
    };

    setMetrics({ memory, cache, timing });
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async (cacheType: string) => {
    switch (cacheType) {
      case 'news':
        newsCache.clear();
        break;
      case 'userStats':
        userStatsCache.clear();
        break;
      case 'all':
        clearAllCaches();
        break;
    }
    fetchMetrics();
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (loading || !metrics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Performance Dashboard</h2>
          </div>
          <button
            onClick={fetchMetrics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Memory Usage</h3>
        </div>

        {metrics.memory ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics.memory.used}MB</div>
                <div className="text-sm text-gray-600">Used Heap</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.memory.total}MB</div>
                <div className="text-sm text-gray-600">Total Heap</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{metrics.memory.limit}MB</div>
                <div className="text-sm text-gray-600">Heap Limit</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(metrics.memory.used / metrics.memory.limit) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {((metrics.memory.used / metrics.memory.limit) * 100).toFixed(1)}% of heap limit used
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Memory monitoring not available in this browser</p>
        )}
      </div>

      {/* Cache Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cache Statistics</h3>
          </div>
          <button
            onClick={() => handleClearCache('all')}
            className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">{metrics.cache.newsCache}</div>
              <div className="text-sm text-gray-600">News Cache</div>
            </div>
            <button
              onClick={() => handleClearCache('news')}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">{metrics.cache.userStatsCache}</div>
              <div className="text-sm text-gray-600">User Stats Cache</div>
            </div>
            <button
              onClick={() => handleClearCache('userStats')}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

        </div>

        <p className="text-sm text-gray-600">
          Total cached items: {metrics.cache.newsCache + metrics.cache.userStatsCache}
        </p>
      </div>

      {/* Performance Timing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Timing</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(metrics.timing.pageLoad)}
            </div>
            <div className="text-sm text-gray-600">Page Load Time</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatTime(metrics.timing.firstPaint)}
            </div>
            <div className="text-sm text-gray-600">First Paint</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(metrics.timing.largestContentfulPaint)}
            </div>
            <div className="text-sm text-gray-600">Largest Contentful Paint</div>
          </div>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Tips</h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Lazy Loading:</strong> Components are loaded on-demand to reduce initial bundle size.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-green-800">
                <strong>Caching:</strong> Frequently accessed data is cached to improve response times.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Debouncing:</strong> Search inputs are debounced to reduce unnecessary API calls.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-purple-800">
                <strong>Batch Processing:</strong> Multiple operations are batched to optimize network requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;