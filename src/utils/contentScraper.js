import axios from 'axios';
import * as cheerio from 'cheerio';

const TIMEOUT = 8000;
const MAX_CONTENT_LENGTH = 3000; // Characters to extract

/**
 * Scrape main readable content from a URL
 */
export const scrapeArticleContent = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: TIMEOUT
    });

    const $ = cheerio.load(response.data);

    // Remove script, style, and nav elements
    $('script, style, nav, footer, .ads, .sidebar, [class*="cookie"]').remove();

    // Try common article content selectors
    let content = '';

    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.post-content',
      '.article-content',
      '.entry-content',
      '[class*="content"]'
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length) {
        content = el.text();
        break;
      }
    }

    // Fallback: get all paragraphs
    if (!content) {
      content = $('p')
        .map((_, el) => $(el).text())
        .get()
        .join(' ');
    }

    // Clean and trim
    content = content
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .trim()
      .substring(0, MAX_CONTENT_LENGTH);

    if (!content) {
      throw new Error('Could not extract content from page');
    }

    return content;
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
};
