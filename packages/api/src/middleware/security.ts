import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import express from 'express';

// CORS yapılandırması
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [/^https:\/\/(.*?\.)?dijitalvitrin\.com$/] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const applySecurityMiddlewares = (app: express.Application) => {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(hpp());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
};
