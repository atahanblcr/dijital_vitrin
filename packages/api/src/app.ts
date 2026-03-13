import express from 'express';
import { applySecurityMiddlewares } from './middleware/security';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';

const app = express();

// 1. Güvenlik ve temel middleware'ler
applySecurityMiddlewares(app);

// 2. Global Rate Limit
app.use(globalRateLimiter);

// 3. API Route'ları
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 4. Bulunamayan Route (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// 5. Global Hata Yakalayıcı (Error Handler)
app.use(errorHandler);

export default app;
