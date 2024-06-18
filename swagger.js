const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Asset Tracking API',
      version: '1.0.0',
      description: 'API documentation for the Asset Tracking application',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Change this to your deployed URL
      },
      {
        url: 'https://asset-tracking-app.vercel.app', // Change this to your deployed URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
            },
          },
        },
        Asset: {
          type: 'object',
          required: ['tagID', 'serialNumber', 'name', 'procurementDate'],
          properties: {
            tagID: {
              type: 'string',
            },
            serialNumber: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            procurementDate: {
              type: 'string',
              format: 'date',
            },
            lifecycleStatus: {
              type: 'string',
              enum: ['active', 'maintenance', 'retired'],
            },
            assignedTo: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
