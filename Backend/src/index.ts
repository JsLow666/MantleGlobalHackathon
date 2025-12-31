// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

// Import routes
import analyzeRoutes from './routes/analyze';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============ Middleware ============

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// JSON body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// ============ Routes ============

app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', {
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
  logger.info(`🚀 ProofFeed Backend v2.0 running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🤖 AI Provider: Google Gemini 1.5 Flash`);
  logger.info('');
  logger.info('✨ Architecture: Backend provides Gemini AI analysis only');
  logger.info('   💰 Users pay gas when submitting to blockchain');
  logger.info('   🔥 Backend has NO gas costs');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;