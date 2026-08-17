import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const url = req.originalUrl || req.url;
  // Skip logging internal Vite dev server asset fetches
  if (
    url.startsWith('/@') ||
    url.startsWith('/src/') ||
    url.startsWith('/node_modules/') ||
    url.startsWith('/favicon.ico')
  ) {
    return next();
  }

  const start = Date.now();
  const requestId = req.headers['x-request-id'] as string || Math.random().toString(36).substring(2, 10);
  (req as any).requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;
    const logData = {
      method: req.method,
      url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress
    };

    if (isError) {
      logger.warn(`HTTP ${req.method} ${url} ${res.statusCode} (${duration}ms)`, {
        context: 'HTTP',
        requestId,
        data: logData,
        durationMs: duration
      });
    } else {
      logger.debug(`HTTP ${req.method} ${url} ${res.statusCode} (${duration}ms)`, {
        context: 'HTTP',
        requestId,
        data: logData,
        durationMs: duration
      });
    }
  });

  next();
}
