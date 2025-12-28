import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeArticleContent } from './contentScraper.js';

const SCRAPER_URL = process.env.SCRAPER_URL || 'https://beyondchats.com/blogs/';

export const scrapeOldestArticles = async (limit = 5) => {
  try {
    const response = await axios.get(SCRAPER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const articles = [];

    // Scrape articles - adjust selectors based on actual website structure
    // Common selectors for blog listings
    const articleElements = $('article, .post, .blog-item, [data-article]').slice(0, limit);

    if (articleElements.length === 0) {
      console.warn('⚠ No articles found with default selectors. Check website structure.');
      return [];
    }

    articleElements.each((index, element) => {
      try {
        const $el = $(element);

        const title =
          $el.find('h2, h3, .title, [class*="title"]').first().text().trim() ||
          $el.find('a').first().text().trim();

        const content =
          $el.find('p, .excerpt, .summary, [class*="excerpt"]').first().text().trim() ||
          $el.find('p').first().text().trim();

        const sourceUrl = $el.find('a').first().attr('href') || $el.attr('href');

        if (title && sourceUrl) {
          const absoluteUrl = sourceUrl.startsWith('http') ? sourceUrl : new URL(sourceUrl, SCRAPER_URL).href;

          articles.push({
            title,
            content: content || title,
            source_url: absoluteUrl,
            type: 'original'
          });
        }
      } catch (err) {
        console.warn('⚠ Error parsing article element:', err.message);
      }
    });

    const detailedArticles = [];
    for (const article of articles.slice(0, limit)) {
      try {
        console.log(`\n📄 Fetching full content for: ${article.title.substring(0, 50)}...`);
        const fullContent = await scrapeArticleContent(article.source_url);
        console.log(`✓ Stored ${fullContent.length} characters`);
        detailedArticles.push({ ...article, content: fullContent });
      } catch (err) {
        console.warn(`⚠ Could not fetch full content for ${article.source_url}: ${err.message}`);
        console.warn(`⚠ Falling back to initial excerpt: "${article.content.substring(0, 80)}..."`);
        detailedArticles.push(article); // fallback to summary/placeholder
      }
    }

    return detailedArticles;
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    throw new Error(`Failed to scrape articles: ${error.message}`);
  }
};
