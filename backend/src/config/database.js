import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'db', 'articles.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  }
});

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          source_url TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL DEFAULT 'original',
          original_article_id INTEGER REFERENCES articles(id),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Ensure older databases get the new column without forcing a migration file
          db.all("PRAGMA table_info(articles);", (infoErr, columns) => {
            if (infoErr) {
              return reject(infoErr);
            }

            const hasOriginalRef = columns.some((col) => col.name === 'original_article_id');

            if (hasOriginalRef) {
              console.log('✓ Database initialized');
              return resolve();
            }

            db.run(
              'ALTER TABLE articles ADD COLUMN original_article_id INTEGER REFERENCES articles(id)',
              (alterErr) => {
                if (alterErr) {
                  return reject(alterErr);
                }
                console.log('✓ Database initialized (added original_article_id column)');
                resolve();
              }
            );
          });
        }
      });
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default db;
