import { randomUUID } from 'node:crypto';
import winston from 'winston';

import type { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cnb-mcp-server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ]
});

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = randomUUID();

  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    headers: {
      traceparent: req.headers['traceparent']
    },
    body: req.body ? JSON.stringify(req.body).substring(0, 500) : undefined,
    ip: req.headers['x-client-ip'] || req.headers['x-real-ip'] || req.ip || req.connection.remoteAddress,
    authLength: req.headers['authorization']?.length,
    requestId
  });

  res.on('finish', () => {
    logger.info('Request finished', {
      statusCode: res.statusCode,
      duration: Date.now() - startTime,
      requestId
    });
  });

  res.on('close', () => {
    logger.info('Request closed', {
      statusCode: res.statusCode,
      duration: Date.now() - startTime,
      requestId
    });
  });

  next();
}
