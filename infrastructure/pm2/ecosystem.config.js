module.exports = {
  apps: [
    {
      name: 'dijital-vitrin-api',
      script: 'npm',
      args: 'run start --workspace=packages/api',
      env: {
        NODE_ENV: 'production',
        API_PORT: 4000
      }
    },
    {
      name: 'dijital-vitrin-storefront',
      script: 'npm',
      args: 'run start --workspace=apps/storefront',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
