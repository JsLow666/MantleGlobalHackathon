// src/routes/analyze.ts
import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import { analyzeNews } from '../ai/factChecker';
import { logger } from '../utils/logger';
import { validateAnalyzeRequest } from '../utils/validation';
import { hashContent } from '../utils/hash';
import { storeContent, getContent, getStorageStats } from '../utils/contentStorage';

const router = Router();

/**
 * POST /api/analyze
 * Analyze news content with AI (backend does NOT submit to blockchain)
 * User will submit to blockchain from frontend with the AI score
 * 
 * Body:
 * {
 *   content: string,       // Required: News content to analyze
 *   title: string,         // Required: News title
 *   sourceUrl: string      // Required: Source URL
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validation = validateAnalyzeRequest(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: validation.errors
      });
    }

    const { content, title, sourceUrl } = req.body;

    logger.info('📥 Received AI analysis request', {
      contentLength: content.length,
      title,
      sourceUrl
    });

    // Step 1: Run AI Analysis
    logger.info('🤖 Starting AI analysis...');
    const analysis = await analyzeNews(content, sourceUrl, title);

    logger.info('✅ AI analysis complete', {
      score: analysis.score,
      verdict: analysis.verdict,
      confidence: analysis.confidence
    });

    // Step 2: Create content hash (frontend will use this)
    const contentHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${title}${content}${sourceUrl}`)
    );

    logger.info('📝 Created content hash', { contentHash });

    // Step 3: Store the full content for later retrieval
    storeContent(contentHash, content, title, sourceUrl);

    // Return AI analysis to frontend
    // Frontend will submit to blockchain with this data
    return res.json({
      success: true,
      analysis: {
        score: analysis.score,
        verdict: analysis.verdict,
        explanation: analysis.explanation,
        reasoning: analysis.reasoning,
        confidence: analysis.confidence,
        flags: analysis.flags,
        sources: analysis.sources
      },
      blockchain: {
        contentHash,
        // Frontend will call: newsRegistry.submitNews(contentHash, title, sourceUrl, score)
        instructions: {
          contract: 'NewsRegistry',
          function: 'submitNews',
          parameters: {
            contentHash,
            title,
            sourceUrl,
            aiScore: analysis.score
          }
        }
      },
      timestamp: analysis.timestamp
    });

  } catch (error: any) {
    logger.error('❌ Analysis failed:', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Analysis Failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/analyze/batch
 * Batch analyze multiple news items
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Items array is required'
      });
    }

    if (items.length > 10) {
      return res.status(400).json({
        error: 'Too many items',
        message: 'Maximum 10 items per batch'
      });
    }

    logger.info('📦 Processing batch analysis', { count: items.length });

    const results = await Promise.allSettled(
      items.map(async (item) => {
        const analysis = await analyzeNews(item.content, item.sourceUrl, item.title);
        const contentHash = hashContent(`${item.title}${item.content}${item.sourceUrl}`);
        
        return {
          analysis,
          contentHash,
          blockchain: {
            contentHash,
            title: item.title,
            sourceUrl: item.sourceUrl,
            aiScore: analysis.score
          }
        };
      })
    );

    const response = results.map((result, index) => ({
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

    return res.json({
      success: true,
      results: response,
      count: items.length
    });

  } catch (error: any) {
    logger.error('Batch analysis failed:', error);
    return res.status(500).json({
      error: 'Batch analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/analyze/quick
 * Quick credibility check (lighter analysis)
 */
router.post('/quick', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 50) {
      return res.status(400).json({
        error: 'Content too short',
        message: 'Content must be at least 50 characters'
      });
    }

    logger.info('⚡ Quick analysis requested');

    // Use lighter AI model or simplified analysis
    const score = 75; // Placeholder - implement quickCheck() from factChecker
    
    return res.json({
      success: true,
      score,
      note: 'Quick analysis - submit for full analysis'
    });

  } catch (error: any) {
    logger.error('Quick analysis failed:', error);
    return res.status(500).json({
      error: 'Quick analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/analyze/content/:hash
 * Retrieve full content by hash
 */
router.get('/content/:hash', async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({
        error: 'Hash Required',
        message: 'Content hash is required'
      });
    }

    logger.info('🔍 Retrieving content by hash', { hash });

    const storedContent = getContent(hash);

    if (!storedContent) {
      return res.status(404).json({
        error: 'Content Not Found',
        message: 'No content found for the provided hash'
      });
    }

    return res.json({
      success: true,
      content: storedContent.content,
      title: storedContent.title,
      sourceUrl: storedContent.sourceUrl,
      timestamp: storedContent.timestamp,
      hash: storedContent.hash
    });

  } catch (error: any) {
    logger.error('❌ Content retrieval failed:', error);
    return res.status(500).json({
      error: 'Content Retrieval Failed',
      message: error.message
    });
  }
});

/**
 * GET /api/analyze/storage/stats
 * Get content storage statistics
 */
router.get('/storage/stats', async (req: Request, res: Response) => {
  try {
    const stats = getStorageStats();
    return res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    logger.error('❌ Storage stats retrieval failed:', error);
    return res.status(500).json({
      error: 'Storage Stats Retrieval Failed',
      message: error.message
    });
  }
});

export default router;