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
  await ensureInit();
  const handler = serverless(app);
  return handler(event, context);
};
