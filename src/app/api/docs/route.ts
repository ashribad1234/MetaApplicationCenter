import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Meta Accounts Center REST API',
      version: '1.0.0',
      description:
        'RESTful API specification for Red Software Meta Accounts Center Assignment. Allows managing connected accounts, profile, security settings, privacy options, device sessions, and activity logs.',
      contact: {
        name: 'Red Software Candidate',
        email: 'sanket.debnath@redsoftware.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Alex Morgan' },
                    email: { type: 'string', example: 'alex@example.com' },
                    password: { type: 'string', example: 'Password123!' },
                    phone: { type: 'string', example: '+15552345678' },
                    dateOfBirth: { type: 'string', example: '1995-06-15' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Validation error' },
            '409': { description: 'Email already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'User Login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'demo@redsoftware.in' },
                    password: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Logged in successfully' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/logout': {
        post: {
          summary: 'Logout current user session',
          tags: ['Authentication'],
          responses: {
            '200': { description: 'Logged out successfully' },
          },
        },
      },
      '/profile': {
        get: {
          summary: 'Get current user profile',
          tags: ['Profile'],
          responses: {
            '200': { description: 'Profile fetched successfully' },
            '401': { description: 'Unauthorized' },
          },
        },
        put: {
          summary: 'Update profile details',
          tags: ['Profile'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    dateOfBirth: { type: 'string' },
                    avatarUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Profile updated successfully' },
          },
        },
      },
      '/connected-accounts': {
        get: {
          summary: 'List connected social accounts',
          tags: ['Connected Accounts'],
          responses: { '200': { description: 'Success' } },
        },
        post: {
          summary: 'Connect a new social account (Facebook, Instagram, WhatsApp)',
          tags: ['Connected Accounts'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['provider'],
                  properties: {
                    provider: { type: 'string', enum: ['FACEBOOK', 'INSTAGRAM', 'WHATSAPP'] },
                    providerUsername: { type: 'string', example: 'alex_official' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Connected successfully' } },
        },
        delete: {
          summary: 'Disconnect a social account',
          tags: ['Connected Accounts'],
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Disconnected successfully' } },
        },
      },
      '/security/change-password': {
        put: {
          summary: 'Change account password',
          tags: ['Security'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Password changed successfully' } },
        },
      },
      '/security/2fa': {
        post: {
          summary: 'Toggle Two-Factor Authentication',
          tags: ['Security'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['enable'],
                  properties: { enable: { type: 'boolean' } },
                },
              },
            },
          },
          responses: { '200': { description: '2FA state updated' } },
        },
      },
      '/privacy': {
        get: { summary: 'Get privacy preferences', tags: ['Privacy'] },
        put: { summary: 'Update privacy preferences', tags: ['Privacy'] },
      },
      '/activity': {
        get: { summary: 'Get activity logs history', tags: ['Activity Logs'] },
      },
      '/devices': {
        get: { summary: 'List active device sessions', tags: ['Device Management'] },
        delete: { summary: 'Revoke device session or all sessions', tags: ['Device Management'] },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
