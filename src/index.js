import 'dotenv/config';
import express from 'express';
import { initializeDatabase } from './config/database.js';
import articlesRouter from './routes/articles.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/articles', articlesRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Articles API: http://localhost:${PORT}/articles`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
