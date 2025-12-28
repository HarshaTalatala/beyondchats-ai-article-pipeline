import axios from 'axios';
import * as cheerio from 'cheerio';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Readability } from '@mozilla/readability';

const TIMEOUT = 15000;
const MAX_CONTENT_LENGTH = 100000; // Characters to extract

/**
 * Scrape main readable content from a URL
 */
export const scrapeArticleContent = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: TIMEOUT,
      maxRedirects: 5
    });

    const html = response.data;

    // First attempt: Readability for cleaner article extraction
    try {
      const virtualConsole = new VirtualConsole();
      virtualConsole.on('error', () => {});
      virtualConsole.on('warn', () => {});
      
      const dom = new JSDOM(html, { url, virtualConsole });
      const doc = dom.window.document;
      
      // Aggressively remove all non-content elements
      const removeSelectors = [
        'script', 'style', 'nav', 'footer', 'header', 'aside',
        'form', 'button', 'iframe', 'noscript',
        '[class*="author"]', '[class*="metadata"]', '[class*="post-meta"]',
        '[class*="byline"]', '[class*="share"]', '[class*="social"]',
        '[class*="comment"]', '[class*="reply"]', '[class*="related"]',
        '.post-date', '.category', '.tags', '.date', 'time',
        '[class*="published"]', '[class*="breadcrumb"]', '.entry-meta',
        'figure', 'figcaption', 'img', 'svg', 'picture',
        '[class*="caption"]', '[class*="credit"]', '[class*="image"]',
        '[class*="reading-time"]', '[class*="views"]', '[class*="likes"]',
        '[role="complementary"]', '[role="navigation"]', '[role="banner"]',
        '.ads', '.ad', '.advertisement', '.sidebar', '.widget'
      ];
      
      removeSelectors.forEach(selector => {
        try {
          const elements = doc.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch (e) {}
      });
      
      const reader = new Readability(doc);
      const parsed = reader.parse();
      
      if (parsed?.textContent && parsed.textContent.trim().length > 200) {
        let text = parsed.textContent;
        
        // Split into lines and aggressively filter
        let lines = text.split(/\n+/).map(line => line.trim()).filter(line => {
          // Skip empty lines
          if (!line) return false;
          
          // Skip lines that are just numbers or very short
          if (line.length < 20) return false;
          
          // Skip lines that look like metadata
          if (/^(by|author|posted|published|category|tags?|share|follow|subscribe)/i.test(line)) return false;
          if (/^\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line)) return false;
          if (/^(uncategorized|comments?|replies|views?|likes?|reading time)/i.test(line)) return false;
          
          // Skip lines that are mostly symbols or numbers
          if (/^[\d\s,.\-:]+$/.test(line)) return false;
          
          // Keep the line if it has substantial text
          return true;
        });
        
        // Remove first line if it's likely the title (since we already have it)
        if (lines.length > 1 && lines[0].length < 100) {
          const firstLineWords = lines[0].toLowerCase().split(/\s+/);
          const potentialTitle = firstLineWords.slice(0, 5).join(' ');
          if (url.toLowerCase().includes(potentialTitle.replace(/\s+/g, '-'))) {
            lines.shift();
          }
        }
        
        text = lines.join('\n\n').trim().substring(0, MAX_CONTENT_LENGTH);
        
        if (text.length > 300) {
          console.log(`✓ Readability extracted ${text.length} chars from ${url}`);
          return text;
        }
      }
    } catch (err) {
      console.log(`⚠ Readability failed: ${err.message}`);
    }

    // Fallback: Cheerio extraction
    const $ = cheerio.load(html);

    // Remove all non-content elements
    $('script, style, nav, footer, header, aside, form, button, iframe, noscript').remove();
    $('[class*="author"], [class*="metadata"], [class*="post-meta"], [class*="byline"]').remove();
    $('[class*="share"], [class*="social"], [class*="comment"], [class*="reply"]').remove();
    $('.post-date, .category, .tags, .date, time, [class*="published"]').remove();
    $('.breadcrumb, [class*="breadcrumb"], .entry-meta').remove();
    $('figure, figcaption, img, svg, picture, [class*="caption"], [class*="credit"]').remove();
    $('[class*="reading-time"], [class*="views"], [class*="likes"], [class*="image"]').remove();
    $('.ads, .ad, .advertisement, .sidebar, .widget, [class*="related"]').remove();

    // Try to find main content
    const contentSelectors = [
      '.post-content p', '.article-content p', '.entry-content p',
      'article p', 'main p', '[role="main"] p',
      '.blog-content p', '.content p'
    ];

    let paragraphs = [];
    for (const selector of contentSelectors) {
      const found = $(selector).map((_, el) => {
        const text = $(el).text().trim();
        // Only keep paragraphs with substantial content
        if (text.length > 50 && !/^[\d\s,.\-:]+$/.test(text)) {
          return text;
        }
      }).get();
      
      if (found.length > 2) {
        paragraphs = found;
        break;
      }
    }

    // Final fallback: all paragraphs
    if (paragraphs.length === 0) {
      paragraphs = $('p').map((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50 && !/^[\d\s,.\-:]+$/.test(text)) {
          return text;
        }
      }).get();
    }

    if (paragraphs.length > 0) {
      const content = paragraphs.join('\n\n').substring(0, MAX_CONTENT_LENGTH);
      console.log(`✓ Cheerio extracted ${content.length} chars from ${url}`);
      return content;
    }

    throw new Error('Could not extract meaningful content');
  } catch (error) {
    console.error(`❌ Failed to scrape ${url}: ${error.message}`);
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
};
