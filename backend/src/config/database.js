import pkg from 'pg';

const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

// Create or reuse a singleton Pool (important for serverless)
const getPool = () => {
  if (!globalThis._pgPool) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Set it to your Neon connection string.');
    }
    const useSsl = Boolean(
      process.env.PG_SSL === 'true' ||
      (DATABASE_URL && /sslmode=require/i.test(DATABASE_URL))
    );

    globalThis._pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: Number.parseInt(process.env.PG_POOL_MAX || '5', 10),
      idleTimeoutMillis: Number.parseInt(process.env.PG_IDLE_TIMEOUT || '10000', 10),
      connectionTimeoutMillis: Number.parseInt(process.env.PG_CONN_TIMEOUT || '5000', 10)
    });
  }
  return globalThis._pgPool;
};

export const pool = getPool();

export const query = async (text, params = []) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

export const initializeDatabase = async () => {
  const ddl = `
    CREATE TABLE IF NOT EXISTS articles (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source_url TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'original',
      original_article_id BIGINT REFERENCES articles(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await query(ddl);
};

export const closeDatabase = async () => {
  if (pool) {
    await pool.end();
  }
};

export default pool;
