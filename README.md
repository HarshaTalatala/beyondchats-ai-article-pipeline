# beyondchats-ai-article-pipeline

AI-powered article scraping and management pipeline.

## Phase 1: Article Scraping & CRUD APIs

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Create database directory:**
   ```bash
   mkdir db
   ```

### Usage

**Start the server:**
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

**Scrape articles:**
```bash
npm run scrape
```

### API Endpoints

- **POST /articles** - Create new article
- **GET /articles** - Fetch all articles
- **GET /articles/:id** - Fetch single article
- **PUT /articles/:id** - Update article
- **DELETE /articles/:id** - Delete article

### Project Structure

```
src/
├── index.js                 # Main server entry point
├── config/
│   └── database.js         # SQLite setup & helpers
├── models/
│   └── articleModel.js     # Database operations
├── routes/
│   └── articles.js         # Article API endpoints
├── utils/
│   └── scraper.js          # Web scraping logic
└── scripts/
    └── scraper.js          # Standalone scraper script
```

### Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite3** - Database
- **Axios** - HTTP client for scraping
- **Cheerio** - DOM parsing for scraping
- **Dotenv** - Environment variables

### Database Schema

```sql
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'original',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Design Rationale

1. **Folder Structure**: Organized by responsibility (routes, models, utils, config) for easy maintenance and scaling
2. **Promise-based Database**: Converts callback-based SQLite3 to async/await for cleaner code
3. **Model Layer**: Separates database logic from routes, making it reusable and testable
4. **Separate Scraper Script**: Allows scraping without running the server
5. **Cheerio + Axios**: Lightweight and perfect for simple web scraping
6. **UNIQUE constraint on source_url**: Prevents duplicate article storage
