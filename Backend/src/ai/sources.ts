// src/ai/sources.ts
import axios from 'axios';
import { logger } from '../utils/logger';

export interface NewsSource {
  name: string;
  url: string;
  snippet?: string;
  publishedAt?: string;
  relevant: boolean;
}

/**
 * Trusted news source domains
 */
export const TRUSTED_SOURCES = [
  'reuters.com',
  'apnews.com',
  'bbc.com',
  'bbc.co.uk',
  'npr.org',
  'theguardian.com',
  'nytimes.com',
  'washingtonpost.com',
  'wsj.com',
  'bloomberg.com',
  'ft.com',
  'economist.com',
  'nature.com',
  'sciencemag.org',
  'who.int',
  'cdc.gov',
  'gov.uk',
  'europa.eu'
];

/**
 * Check if a source is from a trusted domain
 */
export function isTrustedSource(url: string): boolean {
  try {
    const domain = new URL(url).hostname.toLowerCase().replace('www.', '');
    return TRUSTED_SOURCES.some(trusted => domain.includes(trusted));
  } catch {
    return false;
  }
}

/**
 * Fetch related news from trusted sources using NewsAPI
 * Note: For MVP, you can use NewsAPI free tier or mock data
 */
export async function fetchNewsSources(query: string): Promise<NewsSource[]> {
  try {
    // If no NewsAPI key, return empty array (API is optional for MVP)
    if (!process.env.NEWS_API_KEY) {
      logger.warn('NEWS_API_KEY not set, skipping external news fetch');
      return [];
    }

    logger.info('🔍 Fetching related news from external sources...', { query });

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query.substring(0, 100), // Limit query length
        apiKey: process.env.NEWS_API_KEY,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        // Only get from trusted domains
        domains: TRUSTED_SOURCES.slice(0, 10).join(',')
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data.status !== 'ok') {
      logger.warn('NewsAPI returned non-OK status');
      return [];
    }

    const articles = response.data.articles || [];
    const sources: NewsSource[] = articles.map((article: any) => ({
      name: article.source.name,
      url: article.url,
      snippet: article.description || article.title,
      publishedAt: article.publishedAt,
      relevant: true
    }));

    logger.info(`✅ Found ${sources.length} related articles from trusted sources`);

    return sources;

  } catch (error: any) {
    // Don't fail the entire analysis if news fetch fails
    logger.error('Error fetching news sources:', {
      error: error.message,
      code: error.code
    });
    return [];
  }
}

/**
 * Search Google News (alternative to NewsAPI)
 * Note: This is a simplified version - for production use Google Custom Search API
 */
export async function searchGoogleNews(query: string): Promise<NewsSource[]> {
  try {
    if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      logger.warn('Google Search API not configured');
      return [];
    }

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num: 5
      },
      timeout: 10000
    });

    const items = response.data.items || [];
    return items
      .filter((item: any) => isTrustedSource(item.link))
      .map((item: any) => ({
        name: item.displayLink,
        url: item.link,
        snippet: item.snippet,
        relevant: true
      }));

  } catch (error) {
    logger.error('Error searching Google News:', error);
    return [];
  }
}

/**
 * Mock news sources for testing (when APIs not available)
 */
export function getMockSources(query: string): NewsSource[] {
  return [
    {
      name: 'Reuters',
      url: 'https://reuters.com/article/example',
      snippet: 'Related coverage from Reuters news agency.',
      relevant: true
    },
    {
      name: 'BBC News',
      url: 'https://bbc.com/news/example',
      snippet: 'BBC coverage of similar topic.',
      relevant: true
    },
    {
      name: 'Associated Press',
      url: 'https://apnews.com/article/example',
      snippet: 'AP wire service reporting on related events.',
      relevant: true
    }
  ];
}

/**
 * Verify if a URL is accessible
 */
export async function verifyUrlAccessible(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 5
    });
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  }
}

/**
 * Extract domain reputation score
 */
export function getDomainReputation(url: string): {
  score: number;
  tier: 'highly_trusted' | 'trusted' | 'unknown' | 'questionable';
  notes: string;
} {
  try {
    const domain = new URL(url).hostname.toLowerCase().replace('www.', '');

    // Tier 1: Highly trusted (news agencies, government, academic)
    const tier1 = ['reuters.com', 'apnews.com', 'bbc.com', 'who.int', 'cdc.gov', 'nature.com'];
    if (tier1.some(d => domain.includes(d))) {
      return {
        score: 95,
        tier: 'highly_trusted',
        notes: 'Major news agency or authoritative source'
      };
    }

    // Tier 2: Trusted mainstream media
    const tier2 = ['nytimes.com', 'washingtonpost.com', 'theguardian.com', 'wsj.com', 'bloomberg.com'];
    if (tier2.some(d => domain.includes(d))) {
      return {
        score: 85,
        tier: 'trusted',
        notes: 'Established mainstream media outlet'
      };
    }

    // Tier 3: Known but check carefully
    const tier3 = TRUSTED_SOURCES.filter(d => !tier1.includes(d) && !tier2.includes(d));
    if (tier3.some(d => domain.includes(d))) {
      return {
        score: 75,
        tier: 'trusted',
        notes: 'Recognized news source'
      };
    }

    // Unknown domain
    return {
      score: 50,
      tier: 'unknown',
      notes: 'Unknown or unverified source - verify independently'
    };

  } catch {
    return {
      score: 30,
      tier: 'questionable',
      notes: 'Invalid URL or problematic domain'
    };
  }
}