import { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Zap,
  Trash2,
  RefreshCw,
  BarChart3
} from 'lucide-react';
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

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const firstPaintEntry = performance.getEntriesByName('first-paint')[0];
    const lcpEntry = performance.getEntriesByName('largest-contentful-paint')[0];

    const timing = {
      pageLoad: navigation
        ? navigation.loadEventEnd - navigation.fetchStart
        : 0,
      firstPaint: firstPaintEntry ? firstPaintEntry.startTime : 0,
      largestContentfulPaint: lcpEntry ? lcpEntry.startTime : 0
    };

    setMetrics({ memory, cache, timing });
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = (type: string) => {
    if (type === 'news') newsCache.clear();
    if (type === 'userStats') userStatsCache.clear();
    if (type === 'all') clearAllCaches();
    fetchMetrics();
  };

  const formatTime = (ms: number) =>
    ms === 0 ? 'N/A' : ms < 1000 ? `${ms.toFixed(0)} ms` : `${(ms / 1000).toFixed(2)} s`;

  if (loading || !metrics) {
    return (
      <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-8 backdrop-blur">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-cyan-500/20 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-purple-500/10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-cyan-200">

      {/* Header */}
      <div className="relative rounded-xl border border-cyan-500/30 bg-black/70 p-6 backdrop-blur shadow-[0_0_20px_rgba(0,255,255,0.15)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wide text-cyan-300">
              SYSTEM PERFORMANCE
            </h2>
          </div>
          <button
            onClick={fetchMetrics}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg
                       bg-cyan-500/10 border border-cyan-400/30
                       hover:bg-cyan-500/20 transition"
          >
            <RefreshCw className="h-4 w-4 text-cyan-300" />
            <span className="text-cyan-300 text-sm">REFRESH</span>
          </button>
        </div>
      </div>

      {/* Memory */}
      <section className="rounded-xl border border-purple-500/30 bg-black/60 p-6 backdrop-blur shadow-[0_0_16px_rgba(168,85,247,0.15)]">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-purple-300">MEMORY CORE</h3>
        </div>

        {metrics.memory ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'USED', value: metrics.memory.used, color: 'text-cyan-400' },
                { label: 'TOTAL', value: metrics.memory.total, color: 'text-green-400' },
                { label: 'LIMIT', value: metrics.memory.limit, color: 'text-pink-400' }
              ].map((item) => (
                <div key={item.label} className="bg-black/40 border border-white/5 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value} MB
                  </div>
                  <p className="text-xs tracking-widest text-gray-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                style={{ width: `${(metrics.memory.used / metrics.memory.limit) * 100}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-400">Memory data unavailable</p>
        )}
      </section>

      {/* Cache */}
      <section className="rounded-xl border border-orange-500/30 bg-black/60 p-6 backdrop-blur shadow-[0_0_16px_rgba(251,146,60,0.15)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-orange-300">CACHE NODES</h3>
          </div>
          <button
            onClick={() => handleClearCache('all')}
            className="flex items-center space-x-2 px-3 py-1 rounded
                       bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-300">PURGE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'NEWS CACHE', value: metrics.cache.newsCache, key: 'news' },
            { label: 'USER STATS', value: metrics.cache.userStatsCache, key: 'userStats' }
          ].map((item) => (
            <div key={item.label}
              className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg p-4">
              <div>
                <div className="text-xl font-bold text-cyan-400">{item.value}</div>
                <p className="text-xs tracking-widest text-gray-400">{item.label}</p>
              </div>
              <button
                onClick={() => handleClearCache(item.key)}
                className="text-red-400 hover:bg-red-500/10 p-2 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Timing */}
      <section className="rounded-xl border border-cyan-500/30 bg-black/60 p-6 backdrop-blur shadow-[0_0_16px_rgba(0,255,255,0.15)]">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-300">EXECUTION TIMING</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'PAGE LOAD', value: formatTime(metrics.timing.pageLoad) },
            { label: 'FIRST PAINT', value: formatTime(metrics.timing.firstPaint) },
            { label: 'LCP', value: formatTime(metrics.timing.largestContentfulPaint) }
          ].map((item) => (
            <div key={item.label} className="bg-black/40 border border-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{item.value}</div>
              <p className="text-xs tracking-widest text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PerformanceDashboard;
