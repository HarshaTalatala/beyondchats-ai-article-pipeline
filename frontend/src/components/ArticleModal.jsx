import { useEffect } from 'react';

function ArticleModal({ article, onClose }) {
  const { title, content, isAiGenerated, references, sourceUrl, createdAt } = article;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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

  const stop = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={stop}>
        <div className="modal-header">
          <span className={isAiGenerated ? 'badge badge-ai' : 'badge badge-original'}>
            {isAiGenerated ? 'AI-Enhanced' : 'Original'}
          </span>
          <button className="close-button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <h2 className="article-title">{title}</h2>
        {createdAt && (
          <div className="article-date">
            {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}

        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
            View Source →
          </a>
        )}

        <div className="article-content modal-content">
          {paragraphs.map(renderParagraph)}
        </div>

        {references && references.length > 0 && (
          <div className="references-section">
            <h3>References</h3>
            <ul className="references-list">
              {references.map((ref, index) => (
                <li key={index}>
                  <a href={ref} target="_blank" rel="noopener noreferrer" className="reference-link">
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleModal;
