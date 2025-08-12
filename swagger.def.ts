// Basic static documentation for new endpoints (can be extended later)

export const swDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Shield API',
    version: '1.0.0',
    description: 'REST API for Shield'
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server'
    }
  ],
  paths: {
    '/auth/signin': { post: { summary: 'Sign in', tags: ['auth'] } },
    '/auth/signout': { post: { summary: 'Sign out', tags: ['auth'] } },
    '/wallets': {
      get: { summary: 'List wallets', tags: ['wallets'] },
      post: { summary: 'Create wallet', tags: ['wallets'] }
    },
    '/wallets/{id}': {
      get: { summary: 'Get wallet', tags: ['wallets'] },
      put: { summary: 'Update wallet', tags: ['wallets'] },
      delete: { summary: 'Delete wallet', tags: ['wallets'] }
    }
  }
};
