import serverless from 'serverless-http';
import app from '../../backend/src/app.js';
import { initializeDatabase } from '../../backend/src/config/database.js';

let initPromise;

const ensureInit = async () => {
  initPromise = initPromise || initializeDatabase().catch((err) => {
    console.warn('DB init warning:', err?.message || err);
  });
  await initPromise;
};

export const handler = async (event, context) => {
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  await ensureInit();
  const handler = serverless(app);
  return handler(event, context);
};
