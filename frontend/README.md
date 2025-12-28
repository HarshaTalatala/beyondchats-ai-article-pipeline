# BeyondChats Frontend

React + Vite frontend for the AI Article Pipeline.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if needed (default: http://localhost:3000)

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ArticleCard.jsx    # Individual article display
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js
├── package.json
└── .env
```

## Features

- Fetches articles from backend API
- Filters articles by type (All, Original, AI-Enhanced)
- Displays article statistics
- Clean, responsive design
- Error and loading states
- Professional UI without external libraries
