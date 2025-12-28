# BeyondChats AI Article Pipeline

> An intelligent article scraping, enhancement, and management system powered by AI that fetches articles from BeyondChats, enhances them using top-ranking Google search results, and presents them through a beautiful React interface.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Local Setup](#-local-setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Development Journey](#-development-journey)

---

## Features

### Phase 1: Article Scraping & CRUD APIs
- **Web Scraping**: Automatically scrapes the 5 oldest articles from [BeyondChats Blogs](https://beyondchats.com/blogs/)
- **Database Storage**: Stores articles in SQLite database with full metadata
- **RESTful CRUD APIs**: Complete Create, Read, Update, Delete operations
- **Upsert Support**: Prevents duplicate articles using unique source URLs

### Phase 2: AI Enhancement Pipeline
- **Google Search Integration**: Searches article titles on Google using Serper API
- **Content Scraping**: Extracts main content from top 2 ranking articles
- **LLM Rewriting**: Uses Groq AI (Llama 3.1) to rewrite articles in the style of top-ranking content
- **Reference Citations**: Automatically appends source references at the bottom
- **Smart Filtering**: Only enhances original articles, not AI-generated ones

### Phase 3: React Frontend
- **Modern UI/UX**: Clean, professional, responsive design
- **Smart Filtering**: Toggle between All, Original, and AI-Enhanced articles
- **Statistics Dashboard**: Real-time article counts and metrics
- **One-Click Enhancement**: Enhance any original article with a single button
- **Full Article Modal**: Read complete articles in an elegant modal view
- **Visual Badges**: Clearly distinguish between original and AI-enhanced content
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile

---

## Live Demo

### Frontend Application
**Live URL:** `[Will be deployed on Vercel/Netlify]`

> **Note**: The live demo will be available before the submission deadline. You can view:
> - All scraped original articles from BeyondChats
> - AI-enhanced versions with improved formatting and structure
> - Reference citations for enhanced articles
> - Real-time article enhancement capability

### Backend API
**Live URL:** `[Will be deployed on Render/Railway]`

**API Endpoints:**
- `GET /articles` - Fetch all articles
- `GET /articles/:id` - Get single article
- `POST /articles` - Create new article
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article
- `POST /articles/:id/enhance` - Generate AI-enhanced version

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: DATA COLLECTION                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  BeyondChats Website  ──────┐                                       │
│  (beyondchats.com/blogs)     │                                       │
│                              ▼                                       │
│                      ┌──────────────┐                               │
│                      │   Scraper    │  (Cheerio + Axios)            │
│                      │   Script     │  + Readability.js             │
│                      └──────┬───────┘                               │
│                              │                                       │
│                              ▼                                       │
│                      ┌──────────────┐                               │
│                      │   SQLite DB  │                               │
│                      │  (articles)  │                               │
│                      └──────┬───────┘                               │
│                              │                                       │
│                              ▼                                       │
│                      ┌──────────────┐                               │
│                      │  CRUD APIs   │  (Express.js)                 │
│                      │  REST Routes │                               │
│                      └──────────────┘                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: AI ENHANCEMENT PIPELINE                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Original Article  ──────┐                                          │
│  (from database)          │                                          │
│                           ▼                                          │
│                   ┌──────────────┐                                  │
│                   │  Search API  │  (Serper - Google Search)        │
│                   │   Service    │                                  │
│                   └──────┬───────┘                                  │
│                           │                                          │
│                           ▼                                          │
│                   ┌──────────────┐                                  │
│                   │   Top 2 URLs │                                  │
│                   └──────┬───────┘                                  │
│                           │                                          │
│                           ▼                                          │
│                   ┌──────────────┐                                  │
│                   │   Content    │  (JSDOM + Readability)           │
│                   │   Scraper    │  + Cheerio                       │
│                   └──────┬───────┘                                  │
│                           │                                          │
│                           ▼                                          │
│           ┌──────────────────────────────┐                         │
│           │  Original + Reference Content │                         │
│           └──────────┬───────────────────┘                         │
│                      │                                               │
│                      ▼                                               │
│              ┌──────────────┐                                       │
│              │   LLM API    │  (Groq - Llama 3.1 70B)              │
│              │   Service    │                                       │
│              └──────┬───────┘                                       │
│                      │                                               │
│                      ▼                                               │
│              ┌──────────────┐                                       │
│              │  AI-Enhanced │  + Reference Citations                │
│              │   Article    │                                       │
│              └──────┬───────┘                                       │
│                      │                                               │
│                      ▼                                               │
│              ┌──────────────┐                                       │
│              │   Save via   │                                       │
│              │   CRUD API   │                                       │
│              └──────────────┘                                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 3: FRONTEND UI                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────┐          │
│  │              React Frontend (Vite)                    │          │
│  │                                                        │          │
│  │  ┌──────────────────────────────────────────────┐   │          │
│  │  │  App.jsx (Main Component)                     │   │          │
│  │  │  ├─ Filter Bar (All/Original/AI-Enhanced)    │   │          │
│  │  │  ├─ Statistics Display                        │   │          │
│  │  │  └─ Articles Grid                             │   │          │
│  │  └────────────┬─────────────────────────────────┘   │          │
│  │               │                                       │          │
│  │               ▼                                       │          │
│  │  ┌─────────────────────────────────────────────┐    │          │
│  │  │  ArticleCard.jsx (Individual Cards)         │    │          │
│  │  │  ├─ Badge (Original/AI-Enhanced)            │    │          │
│  │  │  ├─ Title & Content Preview                 │    │          │
│  │  │  ├─ "Enhance with AI" Button                │    │          │
│  │  │  └─ References Section                      │    │          │
│  │  └──────────┬──────────────────────────────────┘    │          │
│  │             │                                         │          │
│  │             ▼                                         │          │
│  │  ┌──────────────────────────────────────────┐       │          │
│  │  │  ArticleModal.jsx (Full View)            │       │          │
│  │  │  └─ Complete Article Display             │       │          │
│  │  └──────────────────────────────────────────┘       │          │
│  │                                                        │          │
│  └────────────────────┬───────────────────────────────┘          │
│                        │                                           │
│                        │  HTTP Requests (fetch)                   │
│                        ▼                                           │
│                ┌──────────────┐                                   │
│                │  Backend API │                                   │
│                │  (Port 3000) │                                   │
│                └──────────────┘                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. SCRAPING FLOW
   BeyondChats → Web Scraper → Content Extractor → Database → CRUD API

2. ENHANCEMENT FLOW
   User Request → API Endpoint → Search Google → Scrape Top 2 Articles
   → Send to LLM → Generate Enhanced Article → Add References → Save to DB

3. DISPLAY FLOW
   Frontend Request → Backend API → Database Query → JSON Response
   → React Components → User Interface
```

### Database Schema

```sql
-- SQLite (legacy)
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'original',
  original_article_id INTEGER REFERENCES articles(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```sql
-- PostgreSQL (Neon)
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
```

**Field Descriptions:**
- `id`: Auto-incrementing primary key
- `title`: Article headline/title
- `content`: Full article text content
- `source_url`: Original URL (used as unique constraint)
- `type`: 'original' or 'generated' (AI-enhanced)
- `original_article_id`: Foreign key linking AI-enhanced articles to their source
- `created_at`/`updated_at`: Timestamps for tracking

---

## Tech Stack

### Backend
- **Node.js** (v18+) - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **Axios** - HTTP client for scraping
- **Cheerio** - Fast HTML parsing
- **JSDOM** - DOM implementation for Node.js
- **@mozilla/readability** - Article content extraction
- **Groq SDK** - AI/LLM integration (Llama 3.1 70B)
- **Serper API** - Google Search integration

### Frontend
- **React** (v18) - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

### DevOps & Tools
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload
- **CORS** - Cross-origin resource sharing
- **ESLint** - Code linting (optional)

---

## Local Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/beyondchats-ai-article-pipeline.git
cd beyondchats-ai-article-pipeline
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Scraper Configuration
SCRAPER_URL=https://beyondchats.com/blogs/

# Google Search API (Serper.dev)
# Get free API key from: https://serper.dev/
SERPER_API_KEY=your_serper_api_key_here

# Groq AI API (Free tier available)
# Get free API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.1-70b-versatile
```

#### 2.3 Create Database Directory

```bash
mkdir backend/db
```

#### 2.4 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:3000`

**Auto-scraping**: If the database is empty, the server automatically scrapes 5 articles on startup!

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
```

#### 3.3 Configure Frontend Environment

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

#### 3.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 4: Verify Installation

1. **Backend**: Visit `http://localhost:3000/health` - Should return `{"status": "ok"}`
2. **Frontend**: Visit `http://localhost:5173` - Should display the article dashboard
3. **Database**: Check if articles were auto-scraped in the backend console logs

---

## Usage Guide

### 1. Scraping Articles (Manual)

If you want to manually scrape articles:

```bash
npm run scrape
```

This will:
- Fetch the 5 oldest articles from BeyondChats
- Extract full content from each article page
- Store them in the database (or update if they exist)

### 2. Enhancing Articles

#### Via Frontend UI:
1. Open the frontend at `http://localhost:5173`
2. Find an "Original" article (marked with blue badge)
3. Click the **"Enhance with AI"** button
4. Wait for the enhancement process (20-30 seconds)
5. The new AI-enhanced article will appear with an "AI-Enhanced" badge

#### Via Script:
```bash
npm run enhance
```

This will:
- Randomly select an original article
- Search Google for the article title
- Scrape top 2 ranking articles
- Send content to Groq AI for rewriting
- Save the enhanced version with references

#### Via API:
```bash
curl -X POST http://localhost:3000/articles/1/enhance
```

### 3. Managing Articles via API

#### Get All Articles
```bash
curl http://localhost:3000/articles
```

#### Get Single Article
```bash
curl http://localhost:3000/articles/1
```

#### Create Article
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "content": "Article content here...",
    "source_url": "https://example.com/article",
    "type": "original"
  }'
```

#### Update Article
```bash
curl -X PUT http://localhost:3000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content...",
    "type": "original"
  }'
```

#### Delete Article
```bash
curl -X DELETE http://localhost:3000/articles/1
```

---

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

#### 2. Get All Articles
```http
GET /articles
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Full article content...",
      "source_url": "https://beyondchats.com/blogs/article-1",
      "type": "original",
      "original_article_id": null,
      "created_at": "2025-12-28T10:00:00.000Z",
      "updated_at": "2025-12-28T10:00:00.000Z"
    }
  ]
}
```

---

#### 3. Get Single Article
```http
GET /articles/:id
```

**Parameters:**
- `id` (path) - Article ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "Full article content...",
    "source_url": "https://beyondchats.com/blogs/article-1",
    "type": "original",
    "original_article_id": null,
    "created_at": "2025-12-28T10:00:00.000Z",
    "updated_at": "2025-12-28T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Article not found"
}
```

---

#### 4. Create Article
```http
POST /articles
```

**Request Body:**
```json
{
  "title": "New Article Title",
  "content": "Article content here...",
  "source_url": "https://example.com/article",
  "type": "original"
}
```

**Required Fields:**
- `title` (string)
- `content` (string)
- `source_url` (string, must be unique)

**Optional Fields:**
- `type` (string, default: "original")

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "title": "New Article Title",
    "content": "Article content here...",
    "source_url": "https://example.com/article",
    "type": "original"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields: title, content, source_url"
}
```

---

#### 5. Update Article
```http
PUT /articles/:id
```

**Parameters:**
- `id` (path) - Article ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "type": "original"
}
```

**Required Fields:**
- `title` (string)
- `content` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "source_url": "https://example.com/article",
    "type": "original",
    "updated_at": "2025-12-28T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Article not found"
}
```

---

#### 6. Delete Article
```http
DELETE /articles/:id
```

**Parameters:**
- `id` (path) - Article ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "id": 1
  }
}
```

**Error Response (404):**
```json
{
  "error": "Article not found"
}
```

---

#### 7. Enhance Article with AI
```http
POST /articles/:id/enhance
```

**Parameters:**
- `id` (path) - Original article ID

**Description:**
This endpoint triggers the AI enhancement pipeline:
1. Validates that the article is an "original" type
2. Searches Google for the article title
3. Scrapes top 2 ranking articles
4. Sends content to Groq AI for rewriting
5. Creates a new "generated" article with references

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "title": "Article Title (AI Enhanced)",
    "content": "Enhanced content...\n\n---\n\n## References\n- https://example.com/ref1\n- https://example.com/ref2",
    "source_url": "https://example.com/article#generated-1735380000000",
    "type": "generated",
    "original_article_id": 1,
    "created_at": "2025-12-28T12:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 404 - Article not found
{
  "error": "Article not found"
}

// 400 - Not an original article
{
  "error": "Only original articles can be enhanced"
}

// 500 - Enhancement failed
{
  "error": "No reference articles found for this topic"
}
```

---

## Project Structure

```
beyondchats-ai-article-pipeline/
├── backend/
│   ├── db/
│   │   └── articles.db              # SQLite database file
│   └── src/
│       ├── index.js                 # Main server entry point
│       ├── config/
│       │   └── database.js          # Database connection & helpers
│       ├── models/
│       │   └── articleModel.js      # Article CRUD operations
│       ├── routes/
│       │   └── articles.js          # API route handlers
│       ├── services/
│       │   └── aiEnhancerService.js # AI enhancement orchestration
│       ├── scripts/
│       │   ├── scraper.js           # Standalone scraping script
│       │   └── aiEnhancer.js        # Standalone enhancement script
│       └── utils/
│           ├── scraper.js           # BeyondChats scraping logic
│           ├── contentScraper.js    # Generic article content extractor
│           ├── searchApi.js         # Google Search (Serper) integration
│           └── llmApi.js            # Groq AI/LLM integration
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                 # React app entry point
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css                # Global styles
│   │   └── components/
│   │       ├── ArticleCard.jsx      # Article card component
│   │       └── ArticleModal.jsx     # Full article modal
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend-specific docs
│
├── .env                             # Environment variables (backend)
├── .env.example                     # Environment template (backend)
├── .gitignore                       # Git ignore rules
├── package.json                     # Root/backend dependencies
├── package-lock.json                # Dependency lock file
└── README.md                        # This file
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default | How to Get |
|----------|-------------|----------|---------|------------|
| `PORT` | Server port | No | `3000` | N/A |
| `NODE_ENV` | Environment mode | No | `development` | N/A |
| `SCRAPER_URL` | BeyondChats blog URL | No | `https://beyondchats.com/blogs/` | N/A |
| `SERPER_API_KEY` | Google Search API key | **Yes** | - | [Get free key](https://serper.dev/) |
| `GROQ_API_KEY` | Groq AI API key | **Yes** | - | [Get free key](https://console.groq.com/) |
| `LLM_MODEL` | Groq model name | No | `llama-3.1-70b-versatile` | N/A |
| `DATABASE_URL` | Neon Postgres URL | **Yes** | - | From Neon dashboard |

Example:

```
DATABASE_URL=postgresql://user:password@your-neon-host/dbname?sslmode=require
```

### Serverless-safe Postgres (Neon)

- Use a singleton `Pool` and reuse across invocations to avoid connection storms.
- Keep `max` small (e.g., 5) and set `idleTimeoutMillis` and `connectionTimeoutMillis` to conservative values.
- Enable SSL only when required (Neon uses `sslmode=require`).
- Prefer short-lived queries; avoid long transactions in serverless.
- Use `RETURNING` for inserts/updates to get ids without extra round-trips.
- In this repo, see backend config at [backend/src/config/database.js](backend/src/config/database.js) and schema at [backend/db/schema.sql](backend/db/schema.sql).

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | No | `http://localhost:3000` |

### Getting API Keys

#### Serper API (Google Search)
1. Visit [serper.dev](https://serper.dev/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. **Free tier**: 2,500 searches/month

#### Groq API (AI/LLM)
1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Create an API key
4. **Free tier**: High rate limits with fast inference

---

## Development Journey

This project was built systematically across three phases:

### Phase 1: Foundation (Day 1-2)
- Set up Node.js + Express backend
- Implemented SQLite database with proper schema
- Built web scraping functionality (Cheerio + Axios)
- Created RESTful CRUD APIs
- Added auto-scraping on server startup
- Tested all API endpoints

### Phase 2: AI Integration (Day 3-4)
- Integrated Serper API for Google Search
- Built robust content scraper (Readability + JSDOM + Cheerio)
- Connected Groq AI for article rewriting
- Implemented enhancement service layer
- Added reference citation system
- Created standalone enhancement script

### Phase 3: Frontend (Day 5-6)
- Built React + Vite frontend
- Designed responsive UI with CSS Grid
- Implemented filter functionality
- Added article enhancement from UI
- Created modal for full article view
- Added loading and error states
- Polished styling and UX

### Optimization & Polish (Day 7)
- Fixed VirtualConsole import bug
- Added auto-scraping on empty database
- Improved error handling
- Enhanced content extraction logic
- Added comprehensive documentation
- Prepared for deployment

---

## Deployment Guide

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com/)
3. Import your repository
4. Set build settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend URL
6. Deploy!

### Backend Deployment (Render)

1. Visit [render.com](https://render.com/)
2. Create new Web Service
3. Connect your GitHub repository
4. Set configuration:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: Leave empty (uses root)
5. Add environment variables (all from `.env`)
6. Deploy!

### Alternative: Railway

1. Visit [railway.app](https://railway.app/)
2. Create new project from GitHub
3. Add environment variables
4. Railway auto-detects Node.js and deploys

---

## Testing

### Manual Testing Checklist

#### Backend API
- [ ] Server starts without errors
- [ ] Health endpoint returns OK
- [ ] GET /articles returns all articles
- [ ] GET /articles/:id returns single article
- [ ] POST /articles creates new article
- [ ] PUT /articles/:id updates article
- [ ] DELETE /articles/:id deletes article
- [ ] POST /articles/:id/enhance generates AI article
- [ ] Auto-scraping works on empty database

#### Frontend
- [ ] Page loads without errors
- [ ] Articles display in grid layout
- [ ] Filter buttons work (All/Original/AI-Enhanced)
- [ ] Statistics update correctly
- [ ] "Enhance with AI" button works
- [ ] Loading states display during enhancement
- [ ] Error messages show on failures
- [ ] Article modal opens and closes
- [ ] Responsive design works on mobile
- [ ] References section displays correctly

#### Integration
- [ ] Frontend connects to backend API
- [ ] Enhanced articles appear immediately after creation
- [ ] Refresh preserves data from database
- [ ] No CORS errors in console

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000   # Windows
lsof -i :3000                  # Mac/Linux

# Kill process and restart
npm run dev
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:3000/health

# Check frontend .env
cat frontend/.env

# Ensure CORS is enabled in backend
```

### Scraping returns no articles
```bash
# The BeyondChats website structure may have changed
# Check the console logs for scraping errors
# You may need to update selectors in backend/src/utils/scraper.js
```

### AI enhancement fails
```bash
# Verify API keys are set
echo $SERPER_API_KEY
echo $GROQ_API_KEY

# Check API quotas on provider dashboards
# Serper: https://serper.dev/dashboard
# Groq: https://console.groq.com/
```

### Database errors
```bash
# Delete and recreate database
rm backend/db/articles.db
npm run dev  # Will auto-create tables

# Or manually initialize
sqlite3 backend/db/articles.db < backend/src/config/schema.sql
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Author

**Harsh** (BeyondChats Assignment)

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

---

## Acknowledgments

- **BeyondChats** - For the challenging and educational assignment
- **Groq** - For providing free, fast AI inference
- **Serper** - For Google Search API access
- **Mozilla Readability** - For excellent article extraction
- **React & Vite** - For smooth frontend development

---

## Project Statistics

- **Total Lines of Code**: ~3,000+
- **Development Time**: 7 days
- **API Endpoints**: 7
- **React Components**: 3
- **External APIs**: 2 (Serper, Groq)
- **Database Tables**: 1
- **Features Implemented**: All 3 phases (Complete)

---

## Learning Outcomes

Through this project, I gained experience in:
- Full-stack JavaScript development
- RESTful API design and implementation
- Web scraping techniques and best practices
- AI/LLM integration for content generation
- React state management and component design
- Database design and SQL operations
- Error handling and async operations
- Deployment and DevOps workflows

---

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: your.email@example.com

---

<div align="center">

**Built for BeyondChats**

Star this repo if you found it helpful!

</div>
