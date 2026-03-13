import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@dijital-vitrin/database': path.resolve(__dirname, './packages/database'),
      '@dijital-vitrin/shared': path.resolve(__dirname, './packages/shared'),
      'supertest': path.resolve(__dirname, './node_modules/supertest'),
    }
  },
});
