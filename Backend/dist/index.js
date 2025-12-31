"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
// Import routes
const analyze_1 = __importDefault(require("./routes/analyze"));
const health_1 = __importDefault(require("./routes/health"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ============ Middleware ============
// Security headers
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
// JSON body parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
// Request logging
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});
// ============ Routes ============
app.use('/api/health', health_1.default);
app.use('/api/analyze', analyze_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'ProofFeed API',
        version: '2.0.0',
        status: 'running',
        aiProvider: 'Google Gemini 1.5 Flash',
        architecture: {
            flow: 'User → Backend (Gemini AI + Content Storage) → Frontend → Blockchain',
            note: 'Backend analyzes content with AI and stores full articles - User submits hash to blockchain and pays gas',
            storage: 'Content persisted to disk in JSON format for reliability'
        },
        endpoints: {
            health: 'GET /api/health - System health check',
            analyze: 'POST /api/analyze - Get Gemini AI analysis (returns score for blockchain submission)',
            quick: 'POST /api/analyze/quick - Quick credibility check',
            content: 'GET /api/analyze/content/:hash - Retrieve full article content by hash',
            storage: 'GET /api/analyze/storage/stats - Get content storage statistics'
        },
        usage: {
            step1: 'POST /api/analyze with { content, title, sourceUrl }',
            step2: 'Backend stores full content and returns AI score + contentHash',
            step3: 'User submits to blockchain with: newsRegistry.submitNews(contentHash, title, url, aiScore)',
            step4: 'User pays gas for blockchain transaction',
            step5: 'Frontend retrieves full content via GET /api/analyze/content/:hash'
        }
    });
});
// ============ Error Handling ============
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});
// Global error handler
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path
    });
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// ============ Start Server ============
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 ProofFeed Backend v2.0 running on port ${PORT}`);
    logger_1.logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.logger.info(`🤖 AI Provider: Google Gemini 1.5 Flash`);
    logger_1.logger.info('');
    logger_1.logger.info('✨ Architecture: Backend provides Gemini AI analysis only');
    logger_1.logger.info('   💰 Users pay gas when submitting to blockchain');
    logger_1.logger.info('   🔥 Backend has NO gas costs');
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
exports.default = app;
