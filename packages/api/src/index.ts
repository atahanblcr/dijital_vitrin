import app from './app';
import { env } from './config/env';
import { startDailySummaryJob } from './jobs/dailySummary';

// Initialize cron jobs
startDailySummaryJob();

app.listen(env.API_PORT, () => {
  console.log(`🚀 API Sunucusu http://localhost:${env.API_PORT} adresinde çalışıyor`);
  console.log(`🌍 Ortam: ${env.NODE_ENV}`);
});
