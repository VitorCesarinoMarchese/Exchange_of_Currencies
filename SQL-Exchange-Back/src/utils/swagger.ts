// src/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const setupSwagger = (app: Express): void => {
  // Define Swagger options
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0', 
      info: {
        title: 'My API', 
        version: '1.0.0', 
        description: 'This is a sample API documentation', 
      },
      servers: [
        {
          url: 'http://localhost:3030', 
          description: 'Api docs',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
