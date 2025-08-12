// Basic static documentation for new endpoints (can be extended later)

export const swDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Shield API',
    version: '1.0.0',
    description: 'REST API for Shield'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'integer', example: 400 },
          requestId: { type: 'string' },
          error: { type: 'boolean', example: true },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                path: { type: 'array', items: { type: 'string' } },
                type: { type: 'string' },
                context: { type: 'object' }
              }
            }
          }
        },
        required: ['message', 'code', 'error']
      },
      SigninRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 4 }
        },
        required: ['email', 'password']
      },
      SigninResponse: {
        type: 'object',
        properties: { token: { type: 'string' } },
        required: ['token']
      },
      SignupRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 4 },
          username: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['email', 'password']
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string' },
          username: { type: 'string' },
          name: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'email', 'created_at', 'updated_at']
      },
      Wallet: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          tag: { type: 'string', nullable: true },
          chain: { type: 'string' },
          address: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        },
        required: [
          'id',
          'userId',
          'chain',
          'address',
          'created_at',
          'updated_at'
        ]
      },
      WalletCreateRequest: {
        type: 'object',
        properties: {
          tag: { type: 'string', nullable: true },
          chain: { type: 'string' },
          address: { type: 'string' }
        },
        required: ['chain', 'address']
      },
      WalletUpdateRequest: {
        type: 'object',
        properties: {
          tag: { type: 'string', nullable: true },
          chain: { type: 'string' },
          address: { type: 'string' }
        },
        required: ['chain', 'address']
      }
    }
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server'
    }
  ],
  paths: {
    '/auth/signin': {
      post: {
        summary: 'Sign in',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SigninRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SigninResponse' }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          422: {
            description: 'Unprocessable Entity',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/signup': {
      post: {
        summary: 'Create user',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          409: {
            description: 'Conflict',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          422: {
            description: 'Unprocessable Entity',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/signout': {
      post: {
        summary: 'Sign out',
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'OK' },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/wallets': {
      get: {
        summary: 'List wallets',
        tags: ['wallets'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Wallet' }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create wallet',
        tags: ['wallets'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WalletCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wallet' }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          422: {
            description: 'Unprocessable Entity',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/wallets/{id}': {
      get: {
        summary: 'Get wallet',
        tags: ['wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wallet' }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update wallet',
        tags: ['wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WalletUpdateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wallet' }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          422: {
            description: 'Unprocessable Entity',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete wallet',
        tags: ['wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          204: { description: 'No Content' },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  }
};
