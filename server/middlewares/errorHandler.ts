import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = (req as any).requestId;
  logger.error(`Unhandled request error: ${err.message || 'Internal Server Error'}`, {
    context: 'ErrorHandler',
    requestId,
    error: err.stack || err
  });

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error occurred while processing request.',
    requestId,
    timestamp: new Date().toISOString()
  });
}
