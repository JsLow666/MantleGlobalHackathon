import { useMemo, useRef, useState, useEffect } from 'react';

// Cache implementation for expensive operations
class Cache<T> {
  private cache = new Map<string, { value: T; timestamp: number; ttl: number }>();

  set(key: string, value: T, ttl: number = 5 * 60 * 1000): void { // 5 minutes default TTL
    this.cache.set(key, { value, timestamp: Date.now(), ttl });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const newsCache = new Cache<any>();
export const userStatsCache = new Cache<any>();

// Memoized selector for news filtering
export const useMemoizedNewsFilter = (news: any[], filters: any) => {
  return useMemo(() => {
    let filtered = [...news];

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange) {
      const now = Date.now();
      const rangeMs = filters.dateRange * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(item =>
        (now - item.timestamp * 1000) <= rangeMs
      );
    }

    return filtered;
  }, [news, filters.category, filters.status, filters.search, filters.dateRange]);
};

// Debounced search hook
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Lazy loading hook for components
export const useLazyLoad = (ref: React.RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// LazyImage component has been moved to components/common/LazyImage.tsx

// Bundle optimization - dynamic imports for heavy components
export const loadAdvancedSearch = () => import('../components/search/AdvancedSearch');

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  renderCount.current += 1;

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });

  return renderCount.current;
};

// Optimized batch processing for multiple async operations
export const batchProcess = async <T,>(
  items: T[],
  processor: (item: T) => Promise<any>,
  batchSize: number = 5
): Promise<any[]> => {
  const results: any[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    // Small delay to prevent overwhelming the network
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const mem = (performance as any).memory;
    return {
      used: Math.round(mem.usedJSHeapSize / 1024 / 1024),
      total: Math.round(mem.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Cache statistics
export const getCacheStats = () => ({
  newsCache: newsCache.size(),
  userStatsCache: userStatsCache.size()
});

// Clear all caches
export const clearAllCaches = () => {
  newsCache.clear();
  userStatsCache.clear();
};