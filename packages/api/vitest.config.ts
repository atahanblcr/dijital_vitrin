import path from 'path';

export default {
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
};
