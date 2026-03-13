import app from './app';
import { env } from './config/env';

app.listen(env.API_PORT, () => {
  console.log(`🚀 API Sunucusu http://localhost:${env.API_PORT} adresinde çalışıyor`);
  console.log(`🌍 Ortam: ${env.NODE_ENV}`);
});
