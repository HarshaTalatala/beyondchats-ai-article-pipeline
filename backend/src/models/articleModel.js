import { run, get, all } from '../config/database.js';

export const createArticle = async (articleData) => {
  const { title, content, source_url, type = 'original', original_article_id = null } = articleData;
  
  const sql = `
    INSERT INTO articles (title, content, source_url, type, original_article_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const result = await run(sql, [title, content, source_url, type, original_article_id]);
  return { id: result.id, ...articleData };
};

export const upsertArticle = async (articleData) => {
  const { title, content, source_url, type = 'original', original_article_id = null } = articleData;

  const sql = `
    INSERT INTO articles (title, content, source_url, type, original_article_id)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(source_url) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      type = excluded.type,
      original_article_id = excluded.original_article_id,
      updated_at = CURRENT_TIMESTAMP
  `;

  const result = await run(sql, [title, content, source_url, type, original_article_id]);
  return { id: result.id, ...articleData };
};

export const getAllArticles = async () => {
  const sql = `
    SELECT * FROM articles 
    ORDER BY created_at DESC
  `;
  
  return await all(sql);
};

export const getArticleById = async (id) => {
  const sql = `
    SELECT * FROM articles WHERE id = ?
  `;
  
  return await get(sql, [id]);
};

export const updateArticle = async (id, articleData) => {
  const existing = await getArticleById(id);

  if (!existing) {
    throw new Error('Article not found');
  }

  const { title, content, type, original_article_id = existing.original_article_id } = articleData;
  
  const sql = `
    UPDATE articles 
    SET title = ?, content = ?, type = ?, original_article_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  await run(sql, [title, content, type, original_article_id, id]);

  return await getArticleById(id);
};

export const deleteArticle = async (id) => {
  const sql = `
    DELETE FROM articles WHERE id = ?
  `;
  
  const result = await run(sql, [id]);
  
  if (result.changes === 0) {
    throw new Error('Article not found');
  }
  
  return { success: true, id };
};
