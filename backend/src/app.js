import express from 'express';
import cors from 'cors';
import articlesRouter from './routes/articles.js';

const app = express();

// CORS Configuration - Allow all origins for API
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add explicit OPTIONS handler
app.options('*', cors(corsOptions));

// Routes
app.use('/articles', articlesRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;