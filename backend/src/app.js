import express from 'express';
import cors from 'cors';
import articlesRouter from './routes/articles.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/articles', articlesRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;