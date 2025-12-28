import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.LLM_MODEL || 'llama-3.1-70b-versatile';

/**
 * Call Groq API to rewrite article with inspiration from reference articles
 * Using Groq SDK (FREE tier with fast inference)
 */
export const rewriteArticleWithLLM = async (originalArticle, referenceArticles) => {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  if (referenceArticles.length === 0) {
    throw new Error('At least one reference article is required');
  }

  try {
    // Initialize Groq SDK
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const referenceTexts = referenceArticles
      .map(
        (ref, idx) =>
          `Reference ${idx + 1} (from ${ref.source}):\n${ref.content}`
      )
      .join('\n\n---\n\n');

    const prompt = `You are an expert content writer. I have an original article that I want you to rewrite and improve.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

REFERENCE ARTICLES (for inspiration on structure, style, and approach - do NOT copy):
${referenceTexts}

YOUR TASK:
1. Rewrite the original article to be more engaging and well-structured
2. Be inspired by the reference articles' style and approach, but DO NOT copy or plagiarize
3. Improve clarity, readability, and overall structure
4. Add better formatting with clear sections if needed
5. Keep the core message and facts from the original
6. Make it longer and more comprehensive (but still focused)

IMPORTANT:
- This must be completely original content
- Use the references as inspiration for HOW to write, not WHAT to write
- Create value with your own insights and perspective
- The content should be distinct from both the original and references

Please provide the rewritten article directly without any preamble.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer who creates original, high-quality articles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 2000
    });

    const rewrittenContent = chatCompletion.choices[0].message.content.trim();

    // Add references section
    const referenceSection = `\n\n---\n\n## References\n${referenceArticles
      .map((ref) => `- ${ref.source}`)
      .join('\n')}`;

    return rewrittenContent + referenceSection;
  } catch (error) {
    throw new Error(`LLM API error: ${error.message}`);
  }
};
