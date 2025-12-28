import { searchArticles } from '../utils/searchApi.js';
import { scrapeArticleContent } from '../utils/contentScraper.js';
import { rewriteArticleWithLLM } from '../utils/llmApi.js';
import * as articleModel from '../models/articleModel.js';

const MAX_ORIGINAL_CONTENT_CHARS = 2000;

const assertOriginalArticle = (article) => {
  if (!article) {
    throw new Error('Article not found');
  }

  const type = String(article.type || '').toLowerCase();
  if (type && type !== 'original') {
    throw new Error('Only original articles can be enhanced');
  }

  return article;
};

const findReferenceArticles = async (title) => {
  const results = await searchArticles(title);
  if (!results || results.length === 0) {
    throw new Error('No reference articles found for this topic');
  }
  return results;
};

const scrapeReferenceContent = async (searchResults) => {
  const referencedArticles = [];

  for (const result of searchResults) {
    try {
      const content = await scrapeArticleContent(result.url);
      if (!content) continue;
      referencedArticles.push({
        source: result.url,
        title: result.title,
        content
      });
    } catch (error) {
      // Keep going if one scrape fails
    }
  }

  if (referencedArticles.length === 0) {
    throw new Error('Failed to scrape any reference articles');
  }

  return referencedArticles;
};

const generateEnhancedContent = async (originalArticle, referenceArticles) => {
  const trimmedOriginal = {
    title: originalArticle.title,
    content: (originalArticle.content || '').substring(0, MAX_ORIGINAL_CONTENT_CHARS)
  };

  return rewriteArticleWithLLM(trimmedOriginal, referenceArticles);
};

const buildGeneratedArticlePayload = (originalArticle, generatedContent) => {
  const suffix = `#generated-${Date.now()}`;
  return {
    title: `${originalArticle.title} (AI Enhanced)`,
    content: generatedContent,
    source_url: `${originalArticle.source_url}${suffix}`,
    type: 'generated',
    original_article_id: originalArticle.id
  };
};

export const enhanceArticle = async (originalArticle) => {
  const baseArticle = assertOriginalArticle(originalArticle);
  const searchResults = await findReferenceArticles(baseArticle.title);
  const referenceArticles = await scrapeReferenceContent(searchResults);
  const generatedContent = await generateEnhancedContent(baseArticle, referenceArticles);
  const payload = buildGeneratedArticlePayload(baseArticle, generatedContent);
  return articleModel.createArticle(payload);
};

export const enhanceArticleById = async (articleId) => {
  const article = await articleModel.getArticleById(articleId);
  return enhanceArticle(article);
};

export const getRandomOriginalArticle = async () => {
  const articles = await articleModel.getAllArticles();
  const originalArticles = articles.filter((a) => String(a.type || '').toLowerCase() === 'original');
  if (originalArticles.length === 0) {
    throw new Error('No original articles available');
  }
  return originalArticles[Math.floor(Math.random() * originalArticles.length)];
};
