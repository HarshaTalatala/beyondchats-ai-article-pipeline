import { run, get, all } from '../config/database.js';

export const createArticle = async (articleData) => {
  const { title, content, source_url, type = 'original' } = articleData;
  
  const sql = `
    INSERT INTO articles (title, content, source_url, type)
    VALUES (?, ?, ?, ?)
  `;
  
  const result = await run(sql, [title, content, source_url, type]);
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
  const { title, content, type } = articleData;
  
  const sql = `
    UPDATE articles 
    SET title = ?, content = ?, type = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const result = await run(sql, [title, content, type, id]);
  
  if (result.changes === 0) {
    throw new Error('Article not found');
  }
  
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
