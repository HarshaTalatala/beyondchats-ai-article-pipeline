import express from 'express';
import * as articleModel from '../models/articleModel.js';
const router = express.Router();

// POST /articles - Create a new article
router.post('/', async (req, res) => {
  try {
    const { title, content, source_url, type } = req.body;

    if (!title || !content || !source_url) {
      return res.status(400).json({
        error: 'Missing required fields: title, content, source_url'
      });
    }

    const article = await articleModel.createArticle({
      title,
      content,
      source_url,
      type: type || 'original'
    });

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /articles - Fetch all articles
router.get('/', async (req, res) => {
  try {
    const articles = await articleModel.getAllArticles();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /articles/:id - Fetch a single article
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articleModel.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// PUT /articles/:id - Update an article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Missing required fields: title, content'
      });
    }

    const article = await articleModel.updateArticle(id, {
      title,
      content,
      type: type || 'original'
    });

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE /articles/:id - Delete an article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await articleModel.deleteArticle(id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
});

// POST /articles/:id/enhance - Generate an AI-enhanced version of an original article
router.post('/:id/enhance', async (req, res) => {
  try {
    // Optional guard: disable enhance in serverless by default
    if (process.env.ENABLE_ENHANCE !== 'true') {
      return res.status(503).json({ error: 'Enhance endpoint is disabled in this environment' });
    }

    // Lazy load the AI enhancer service to avoid bundling jsdom in the main function
    const { enhanceArticleById } = await import('../services/aiEnhancerService.js');

    const { id } = req.params;
    const generatedArticle = await enhanceArticleById(id);

    res.status(201).json({
      success: true,
      data: generatedArticle
    });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === 'Only original articles can be enhanced') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({
      error: error.message || 'Failed to enhance article'
    });
  }
});

export default router;
