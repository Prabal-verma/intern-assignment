import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint for keep-alive monitoring
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
    }
  };

  // Log keep-alive requests in production
  if (process.env.NODE_ENV === 'production') {
    const userAgent = req.get('User-Agent') || 'Unknown';
    if (userAgent.includes('KeepAlive')) {
      console.log(`🏥 Health check (keep-alive) at ${healthData.timestamp}`);
    }
  }

  res.status(200).json(healthData);
});

/**
 * Simple ping endpoint
 * GET /api/ping
 */
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

export default router;
