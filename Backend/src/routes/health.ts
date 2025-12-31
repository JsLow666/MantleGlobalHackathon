// src/routes/health.ts
import { Router, Request, Response } from 'express';
import { validateContractAddresses } from '../config/contracts';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // Check contract addresses configured
    const contractsConfigured = validateContractAddresses();

    // Check environment variables
    const envCheck = {
      hasGeminiKey: !!process.env.GOOGLE_AI_API_KEY,
      hasRpcUrl: !!process.env.MANTLE_TESTNET_RPC,
      hasContractAddresses: contractsConfigured
    };

    const isHealthy = 
      envCheck.hasGeminiKey &&
      envCheck.hasRpcUrl &&
      envCheck.hasContractAddresses;

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV || 'development',
      services: {
        ai: envCheck.hasGeminiKey ? 'Google Gemini' : 'Not configured',
        aiStatus: envCheck.hasGeminiKey,
        rpc: envCheck.hasRpcUrl,
        contracts: envCheck.hasContractAddresses
      },
      architecture: {
        role: 'AI Analysis Service Only',
        aiProvider: 'Google Gemini 1.5 Flash',
        gasCost: 'ZERO - Users pay gas when submitting to blockchain',
        flow: 'Backend (Gemini AI) → Frontend → Blockchain (User pays gas)'
      }
    };

    logger.info('Health check completed', { status: healthData.status });

    res.status(isHealthy ? 200 : 503).json(healthData);

  } catch (error: any) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;