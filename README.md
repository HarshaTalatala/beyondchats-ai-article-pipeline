# BeyondChats AI Article Pipeline

An intelligent, end-to-end article management system that automates content discovery, AI-powered enhancement, and presentation through a responsive web interface.

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

### Phase 1: Content Discovery & API Layer
- **Web Scraping**: Automatically scrapes articles from BeyondChats
- **Data Persistence**: Stores articles in SQLite database with comprehensive metadata
- **RESTful APIs**: Complete CRUD operations for article management
- **Duplicate Prevention**: Upsert mechanism prevents duplicate entries using source URLs

### Phase 2: AI Enhancement Pipeline
- **Search Integration**: Leverages Google Search API to identify relevant reference material
- **Content Extraction**: Retrieves and processes top-ranking articles for reference
- **LLM-Powered Rewriting**: Uses Groq AI (Llama 3.1) to enhance content quality and structure
- **Source Attribution**: Automatically appends verifiable source references
- **Intelligent Filtering**: Distinguishes between original and AI-generated content

### Phase 3: User Interface
- **Modern Design**: Clean, professional, and fully responsive interface
- **Advanced Filtering**: View All, Original Only, or AI-Enhanced articles
- **Metrics Dashboard**: Real-time statistics on article inventory
- **One-Click Enhancement**: Streamlined article enhancement workflow
- **Article Preview**: Comprehensive modal view with full content
- **Visual Indicators**: Clear badges distinguish content types
- **Cross-Device Support**: Optimized for desktop, tablet, and mobile devices

---

## Live Demo

### Deployed Application

- **Frontend**: [https://beyondchats-ai-article-pipeline.vercel.app/](https://beyondchats-ai-article-pipeline.vercel.app/)
- **Backend**: Deployed on Netlify
- **Database**: PostgreSQL on NeonDB

The full-stack application is production-ready and fully functional.

---

## Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                        BEYONDCHATS AI PIPELINE                            │
│                                                                            │
│  ┌────────────┐      ┌─────────────┐      ┌──────────────┐              │
│  │   DATA     │      │     AI      │      │   FRONTEND   │              │
│  │ DISCOVERY  │  →   │ ENHANCEMENT │  →   │    (React)   │              │
│  └────────────┘      └─────────────┘      └──────────────┘              │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Content Discovery

```
BeyondChats Website
        ↓
    Scraper (Cheerio + Axios + Readability)
        ↓
    PostgreSQL (NeonDB)
        ↓
    REST APIs (Express.js)
```

### Phase 2: AI Enhancement Pipeline

```
Original Article (from DB)
        ↓
Search API (Serper - Google Search)
        ↓
Top 2 Reference Articles
        ↓
Content Scraper (JSDOM + Readability + Cheerio)
        ↓
LLM Service (Groq - Llama 3.1 70B)
        ↓
AI-Enhanced Article + Citations
        ↓
Save to Database
```

### Phase 3: User Interface

```
React Frontend (Vite)
├─ Filter Controls (All/Original/AI-Enhanced)
├─ Statistics Dashboard
├─ Article Grid
│  └─ ArticleCard Components
│     ├─ Content Badge
│     ├─ Article Preview
│     └─ Enhance Button
└─ ArticleModal (Full Article View)
        ↓
Backend API (HTTP/REST)
        ↓
Database Queries

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

## Technology Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** - REST API framework
- **SQLite3** - Embedded relational database
- **Axios** - HTTP client
- **Cheerio** - HTML parsing and DOM manipulation
- **JSDOM** - JavaScript DOM implementation for Node.js
- **@mozilla/readability** - Intelligent article content extraction
- **Groq SDK** - Large language model integration
- **Serper API** - Search engine API integration

### Frontend
- **React** (v18) - User interface framework
- **Vite** - Build tooling and development server
- **CSS3** - Styling and responsive design
- **Fetch API** - HTTP communication

### Development Tools
- **dotenv** - Environment configuration management
- **nodemon** - Automatic server reload during development
- **CORS** - Cross-origin request handling

---

## Local Setup

### Prerequisites

Ensure the following are installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** - Included with Node.js
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/beyondchats-ai-article-pipeline.git
cd beyondchats-ai-article-pipeline
```

### Step 2: Backend Configuration

#### 2.1 Install Dependencies

```bash
npm install
```

#### 2.2 Configure Environment

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Scraper
SCRAPER_URL=https://beyondchats.com/blogs/

# Google Search API - Get free key from https://serper.dev/
SERPER_API_KEY=your_key_here

# Groq AI API - Get free key from https://console.groq.com/
GROQ_API_KEY=your_key_here
LLM_MODEL=llama-3.1-70b-versatile
```

#### 2.3 Initialize Database

```bash
mkdir -p backend/db
```

#### 2.4 Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3000`

### Step 3: Frontend Configuration

#### 3.1 Navigate to Frontend

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

#### 3.4 Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 4: Verification

1. **Backend**: Visit `http://localhost:3000/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **Database**: Check console logs for auto-scraped articles

---

## Usage Guide

### Manual Scraping

```bash
npm run scrape
```

### Article Enhancement

#### From UI
1. Open frontend at `http://localhost:5173`
2. Locate an original article (blue badge)
3. Click "Enhance with AI"
4. Wait for processing (20-30 seconds)

#### Via Script
```bash
npm run enhance
```

#### Via API
```bash
curl -X POST http://localhost:3000/articles/1/enhance
```

---

## API Documentation

### Base URL
```
http://localhost:3000
```

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
- See [backend/src/config/database.js](backend/src/config/database.js) and [backend/db/schema.sql](backend/db/schema.sql) for examples.

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | No | `http://localhost:3000` |

### Getting API Keys

#### Serper (Google Search)
1. Visit [serper.dev](https://serper.dev/)
2. Register for free account
3. Copy API key from dashboard
4. **Free Tier**: 2,500 searches/month

#### Groq (AI/LLM)
1. Visit [console.groq.com](https://console.groq.com/)
2. Create account
3. Generate API key
4. **Free Tier**: Generous rate limits

---

## Development Guide

### Project Architecture

The application follows a three-phase architecture:

1. **Data Collection**: Web scraping and CRUD operations
2. **AI Enhancement**: Content augmentation with language models
3. **Presentation**: User interface and client interactions

## Deployment

### Frontend (Vercel) ✅
Deployed at: https://beyondchats-ai-article-pipeline.vercel.app/

Configuration:
- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output: `dist`
- Environment: `VITE_API_BASE_URL`

### Backend (Netlify) ✅
Successfully deployed with serverless functions.

### Database (NeonDB) ✅
PostgreSQL database hosted on NeonDB for production use.

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

**Harsha** - BeyondChats Project

---

## Acknowledgments

- **BeyondChats** - Project foundation
- **Groq** - Free AI inference  
- **Serper** - Search API integration
- **Mozilla Readability** - Content extraction
- **React & Vite** - Development tools

---

<div align="center">

Built with professional coding standards.

</div>
