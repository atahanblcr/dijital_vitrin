import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [path.resolve(__dirname, './src/__tests__/setup.ts')],
    include: ['src/**/*.test.ts'],
    alias: {
      '@dijital-vitrin/database': path.resolve(__dirname, '../database'),
      '@dijital-vitrin/shared': path.resolve(__dirname, '../shared'),
    }
  }
});
