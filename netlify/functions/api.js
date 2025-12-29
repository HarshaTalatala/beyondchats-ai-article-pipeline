import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import { initializeDatabase } from '../../backend/src/config/database.js';

let initPromise;

const ensureInit = async () => {
  if (!initPromise) {
    initPromise = initializeDatabase().catch((err) => {
      console.error('DB initialization error:', err?.message || err);
      // Don't throw - allow function to continue even if DB init fails
    });
  }
  await initPromise;
};

export const handler = async (event, context) => {
  // Prevent AWS Lambda from waiting for empty event loop
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('Function invoked:', event.httpMethod, event.path);

  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  try {
    // Initialize database
    await ensureInit();

    // Create serverless handler
    const serverlessHandler = serverless(app, {
      request(request, event, context) {
        // Log request details
        console.log('Processing request:', event.path);
      },
      response(response, event, context) {
        // Add CORS headers to all responses
        if (!response.headers) {
          response.headers = {};
        }
        response.headers['Access-Control-Allow-Origin'] = '*';
        response.headers['Access-Control-Allow-Credentials'] = 'true';
      }
    });

    // Execute the handler
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
