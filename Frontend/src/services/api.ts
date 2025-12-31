// API service for backend communication
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if backend runs on different port

export interface AnalyzeRequest {
  title: string;
  content: string;
  sourceUrl: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: {
    score: number;
    verdict: string;
    explanation: string;
    reasoning: string;
    confidence: number;
    flags: string[];
    sources: string[];
  };
  blockchain: {
    contentHash: string;
    instructions: {
      contract: string;
      function: string;
      parameters: {
        contentHash: string;
        title: string;
        sourceUrl: string;
        aiScore: number;
      };
    };
  };
  timestamp: string;
}

export interface ContentResponse {
  success: boolean;
  content: string;
  title: string;
  sourceUrl: string;
  timestamp: string;
  hash: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message || errorData.error);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error: any) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  async analyzeNews(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.request<AnalyzeResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async quickAnalyze(content: string): Promise<{ success: boolean; score: number; note: string }> {
    return this.request('/analyze/quick', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getContentByHash(hash: string): Promise<ContentResponse> {
    return this.request<ContentResponse>(`/analyze/content/${hash}`);
  }
}

export const apiService = new ApiService();