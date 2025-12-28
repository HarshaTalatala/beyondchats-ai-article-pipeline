function ArticleCard({ article, onOpen, onEnhance, enhancing }) {
  const { title, content, isAiGenerated, references, sourceUrl, createdAt } = article;

  const normalizedContent = (content || '')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\n{2,}/g, '\n\n');

  const splitAndTrim = (text, regex) =>
    text
      .split(regex)
      .map((p) => p.trim())
      .filter(Boolean);

  let paragraphs = splitAndTrim(normalizedContent, /\n\s*\n/);

  // If still one blob, try single newlines
  if (paragraphs.length <= 1) {
    const lines = splitAndTrim(normalizedContent, /\n/);
    if (lines.length > 1) {
      paragraphs = lines;
    }
  }

  // If still one blob, chunk by sentences
  if (paragraphs.length <= 1) {
    const sentences = splitAndTrim(normalizedContent, /(?<=[.?!])\s+/);
    const chunkSize = 3;
    const chunks = [];
    for (let i = 0; i < sentences.length; i += chunkSize) {
      chunks.push(sentences.slice(i, i + chunkSize).join(' '));
    }
    if (chunks.length) {
      paragraphs = chunks;
    }
  }
  const MAX_PARAGRAPHS = 3;
  const contentLength = (content || '').length;
  const hasMore = paragraphs.length > MAX_PARAGRAPHS || contentLength > 500;
  const visibleParagraphs = paragraphs.slice(0, MAX_PARAGRAPHS);

  const escapeHtml = (str = '') =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const formatBold = (text = '') => {
    const escaped = escapeHtml(text);
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  };

  const renderParagraph = (paragraph, index) => {
    const looksLikeHeading =
      paragraph.length <= 90 &&
      !/[.!?]\s/.test(paragraph) &&
      /^[A-Z]/.test(paragraph.trim());

    const html = formatBold(paragraph);

    if (looksLikeHeading) {
      return <p key={index} className="para-heading" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return <p key={index} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const handleCardClick = () => {
    onOpen?.(article);
  };

  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    callback?.();
  };

  return (
    <article 
      className={`article-card ${isAiGenerated ? 'ai-enhanced' : 'original'}`}
      onClick={handleCardClick}
    >
      <div className="article-header">
        <span className={`badge ${isAiGenerated ? 'badge-ai' : 'badge-original'}`}>
          {isAiGenerated ? '✨ AI-Enhanced' : '📄 Original'}
        </span>
        {createdAt && (
          <span className="article-date">
            {new Date(createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )}
      </div>

      <h2 className="article-title">{title}</h2>

      {sourceUrl && (
        <a 
          href={sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="source-link"
          onClick={(e) => e.stopPropagation()}
        >
          View Source →
        </a>
      )}

      <div className="article-content">
        {visibleParagraphs.map(renderParagraph)}
      </div>

      <div className="card-actions">
        {hasMore && (
          <button 
            className="toggle-button" 
            onClick={(e) => handleButtonClick(e, () => onOpen?.(article))}
          >
            Read full article
          </button>
        )}

        {!isAiGenerated && onEnhance && (
          <button
            type="button"
            className="primary-button"
            onClick={(e) => handleButtonClick(e, () => onEnhance(article.id))}
            disabled={enhancing}
          >
            {enhancing ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="references-section">
          <h3>References</h3>
          <ul className="references-list">
            {references.map((ref, index) => (
              <li key={index}>
                <a 
                  href={ref} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="reference-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default ArticleCard;
