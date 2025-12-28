import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import articlesRouter from './routes/articles.js';
import * as articleModel from './models/articleModel.js';
import { scrapeOldestArticles } from './utils/scraper.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/articles', articlesRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Check and auto-scrape articles if database is empty
const checkAndScrapeArticles = async () => {
  try {
    const articles = await articleModel.getAllArticles();
    const originalArticles = articles.filter(a => a.type === 'original');
    
    if (originalArticles.length === 0) {
      console.log('📭 No original articles found in database');
      console.log('🕷️  Starting automatic scraping...\n');
      
      const scrapedArticles = await scrapeOldestArticles(5);
      
      if (scrapedArticles.length === 0) {
        console.log('⚠️  No articles could be scraped');
        return;
      }
      
      console.log(`\n💾 Storing ${scrapedArticles.length} articles in database...`);
      for (const article of scrapedArticles) {
        try {
          await articleModel.upsertArticle(article);
          console.log(`✓ Saved: "${article.title.substring(0, 60)}..."`);
        } catch (err) {
          console.error(`❌ Error saving article:`, err.message);
        }
      }
      console.log('✅ Auto-scraping complete!\n');
    } else {
      console.log(`✓ Found ${originalArticles.length} original article(s) in database`);
    }
  } catch (error) {
    console.warn('⚠️  Auto-scrape failed:', error.message);
  }
};

// Initialize and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    // Check if we need to scrape articles
    await checkAndScrapeArticles();

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
