import 'dotenv/config';
import * as articleModel from '../models/articleModel.js';
import { scrapeOldestArticles } from '../utils/scraper.js';
import { initializeDatabase, closeDatabase } from '../config/database.js';

const main = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('🗄️  Database ready\n');

    // Scrape articles
    console.log('🕷️  Scraping articles from', process.env.SCRAPER_URL);
    const articles = await scrapeOldestArticles(5);

    if (articles.length === 0) {
      console.log('❌ No articles found to scrape');
      await closeDatabase();
      process.exit(0);
    }

    console.log(`✓ Found ${articles.length} articles\n`);

    // Store in database
    console.log('💾 Storing articles in database (upsert by source_url)...');
    for (const article of articles) {
      try {
        const saved = await articleModel.upsertArticle(article);
        console.log(`✓ Saved/updated: "${article.title.substring(0, 60)}..."`);
      } catch (err) {
        console.error(`❌ Error saving article:`, err.message);
      }
    }

    console.log('\n✅ Scraping complete!');
    await closeDatabase();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

main();
