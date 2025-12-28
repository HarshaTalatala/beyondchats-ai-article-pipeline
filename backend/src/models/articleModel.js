import { query } from '../config/database.js';

export const createArticle = async (articleData) => {
  const { title, content, source_url, type = 'original', original_article_id = null } = articleData;

  const sql = `
    INSERT INTO articles (title, content, source_url, type, original_article_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const { rows } = await query(sql, [title, content, source_url, type, original_article_id]);
  const insertedId = rows[0]?.id;
  return { id: insertedId, ...articleData };
};

export const upsertArticle = async (articleData) => {
  const { title, content, source_url, type = 'original', original_article_id = null } = articleData;

  const sql = `
    INSERT INTO articles (title, content, source_url, type, original_article_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (source_url) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      type = EXCLUDED.type,
      original_article_id = EXCLUDED.original_article_id,
      updated_at = NOW()
    RETURNING id
  `;

  const { rows } = await query(sql, [title, content, source_url, type, original_article_id]);
  const upsertedId = rows[0]?.id;
  return { id: upsertedId, ...articleData };
};

export const getAllArticles = async () => {
  const sql = `
    SELECT * FROM articles 
    ORDER BY created_at DESC
  `;

  const { rows } = await query(sql);
  return rows;
};

export const getArticleById = async (id) => {
  const sql = `
    SELECT * FROM articles WHERE id = $1
  `;

  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

export const updateArticle = async (id, articleData) => {
  const existing = await getArticleById(id);

  if (!existing) {
    throw new Error('Article not found');
  }

  const { title, content, type, original_article_id = existing.original_article_id } = articleData;

  const sql = `
    UPDATE articles 
    SET title = $1, content = $2, type = $3, original_article_id = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;

  const { rows } = await query(sql, [title, content, type, original_article_id, id]);
  return rows[0] || null;
};

export const deleteArticle = async (id) => {
  const sql = `
    DELETE FROM articles WHERE id = $1
  `;

  const { rowCount } = await query(sql, [id]);

  if (rowCount === 0) {
    throw new Error('Article not found');
  }

  return { success: true, id };
};
