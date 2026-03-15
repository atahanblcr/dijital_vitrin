import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import express from 'express';

// CORS yapılandırması
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Postman gibi araçlar origin göndermeyebilir
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
        return regex.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const applySecurityMiddlewares = (app: express.Application) => {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(hpp());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};
