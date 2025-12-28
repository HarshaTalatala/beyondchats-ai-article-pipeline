import { useState, useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, original, ai-enhanced
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [enhancingId, setEnhancingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/articles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      const rawArticles = Array.isArray(payload) ? payload : payload?.data || [];

      if (!Array.isArray(rawArticles)) {
        throw new Error('Malformed response: expected an array of articles');
      }

      const normalized = rawArticles.map((article, idx) => {
        const type = article.type || article.article_type;
        const isAiGenerated =
          article.isAiGenerated !== undefined
            ? Boolean(article.isAiGenerated)
            : ['ai', 'ai-enhanced', 'ai_enhanced', 'generated', 'ai_generated'].includes(String(type).toLowerCase());

        const contentValue =
          article.content ||
          article.ai_content ||
          article.aiContent ||
          article.original_content ||
          article.originalContent ||
          '';

        const titleValue = article.title || article.heading || article.headline || 'Untitled';

        return {
          ...article,
          id: article.id || article._id || idx,
          isAiGenerated,
          createdAt: article.createdAt || article.created_at,
          sourceUrl: article.sourceUrl || article.source_url,
          references: article.references || article.aiReferences || article.refs || [],
          content: contentValue,
          title: titleValue,
        };
      });

      setArticles(normalized);
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const enhanceArticle = async (articleId) => {
    try {
      setActionError(null);
      setEnhancingId(articleId);

      const response = await fetch(`${API_BASE_URL}/articles/${articleId}/enhance`, {
        method: 'POST'
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || `Failed with status ${response.status}`;
        throw new Error(message);
      }

      await fetchArticles();
    } catch (err) {
      setActionError(err.message || 'Failed to enhance article');
    } finally {
      setEnhancingId(null);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    if (filter === 'original') return !article.isAiGenerated;
    if (filter === 'ai-enhanced') return article.isAiGenerated;
    return true;
  });

  const originalCount = articles.filter(a => !a.isAiGenerated).length;
  const aiCount = articles.filter(a => a.isAiGenerated).length;

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>BeyondChats AI Article Pipeline</h1>
          <p className="subtitle">Original articles enhanced with AI-powered insights</p>
        </div>
      </header>

      <main className="container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h2>Error Loading Articles</h2>
            <p>{error}</p>
            <button onClick={fetchArticles} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="stats-bar">
              <div className="stats">
                <span className="stat-item">
                  <strong>{articles.length}</strong> Total Articles
                </span>
                <span className="stat-item">
                  <strong>{originalCount}</strong> Original
                </span>
                <span className="stat-item">
                  <strong>{aiCount}</strong> AI-Enhanced
                </span>
              </div>
              
              <div className="filter-buttons">
                <button 
                  className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={filter === 'original' ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setFilter('original')}
                >
                  Original
                </button>
                <button 
                  className={filter === 'ai-enhanced' ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setFilter('ai-enhanced')}
                >
                  AI-Enhanced
                </button>
              </div>
            </div>

            {actionError && (
              <div className="inline-error">
                <span>{actionError}</span>
                <button className="retry-button" onClick={() => setActionError(null)}>Dismiss</button>
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="empty-state">
                <p>No articles found matching the selected filter.</p>
              </div>
            ) : (
              <div className="articles-grid">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id || article._id} 
                    article={article}
                    onOpen={() => setSelectedArticle(article)}
                    onEnhance={enhanceArticle}
                    enhancing={enhancingId === article.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 BeyondChats AI Article Pipeline</p>
        </div>
      </footer>

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;
