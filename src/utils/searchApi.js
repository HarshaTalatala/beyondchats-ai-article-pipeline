import axios from 'axios';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_URL = 'https://google.serper.dev/search';

/**
 * Search for articles related to a topic using Serper API
 */
export const searchArticles = async (query) => {
  if (!SERPER_API_KEY) {
    throw new Error('SERPER_API_KEY is not set in environment variables');
  }

  try {
    const response = await axios.post(
      SERPER_URL,
      {
        q: query,
        num: 10 // Get top 10 results to filter
      },
      {
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    // Filter results to get article links (exclude PDFs, non-article pages)
    // Serper returns results in 'organic' field for regular search
    const results = response.data.organic || response.data.news || response.data.searchResults || [];
    
    if (results.length === 0) {
      console.warn('⚠ No search results returned from Serper API');
      console.warn('Response data:', JSON.stringify(response.data).substring(0, 200));
    }
    
    const articleLinks = results
      .filter((result) => {
        const url = result.link?.toLowerCase() || '';
        const title = result.title?.toLowerCase() || '';

        // Exclude PDFs, images, videos, and non-content pages
        return !url.includes('.pdf') &&
               !url.includes('youtube.com') &&
               !url.includes('instagram.com') &&
               !url.includes('twitter.com') &&
               !url.includes('facebook.com') &&
               !title.includes('video') &&
               result.link;
      })
      .slice(0, 2) // Get top 2
      .map((result) => ({
        url: result.link,
        title: result.title,
        snippet: result.snippet
      }));

    return articleLinks;
  } catch (error) {
    throw new Error(`Search API error: ${error.message}`);
  }
};
