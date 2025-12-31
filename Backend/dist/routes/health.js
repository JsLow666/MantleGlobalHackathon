"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/health.ts
const express_1 = require("express");
const contracts_1 = require("../config/contracts");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req, res) => {
    try {
        const startTime = Date.now();
        // Check contract addresses configured
        const contractsConfigured = (0, contracts_1.validateContractAddresses)();
        // Check environment variables
        const envCheck = {
            hasGeminiKey: !!process.env.GOOGLE_AI_API_KEY,
            hasRpcUrl: !!process.env.MANTLE_TESTNET_RPC,
            hasContractAddresses: contractsConfigured
        };
        const isHealthy = envCheck.hasGeminiKey &&
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
        logger_1.logger.info('Health check completed', { status: healthData.status });
        res.status(isHealthy ? 200 : 503).json(healthData);
    }
    catch (error) {
        logger_1.logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
