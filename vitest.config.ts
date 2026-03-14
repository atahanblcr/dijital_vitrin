import path from 'path';

export default {
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@dijital-vitrin/database': path.resolve(__dirname, './packages/database'),
      '@dijital-vitrin/shared': path.resolve(__dirname, './packages/shared'),
    }
  },
};
