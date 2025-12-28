import 'dotenv/config';
import axios from 'axios';
import { searchArticles } from '../utils/searchApi.js';
import { scrapeArticleContent } from '../utils/contentScraper.js';
import { rewriteArticleWithLLM } from '../utils/llmApi.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// ============================================================================
// STEP 1: Fetch a random original article from the API
// ============================================================================
const fetchOriginalArticle = async () => {
  try {
    console.log('\n📖 STEP 1: Fetching original article...');
    
    const response = await axios.get(`${API_BASE_URL}/articles`);
    const articles = response.data.data || [];

    // Filter original articles only
    const originalArticles = articles.filter((a) => a.type === 'original');

    if (originalArticles.length === 0) {
      throw new Error('No original articles found in database');
    }

    // Pick a random one
    const article = originalArticles[Math.floor(Math.random() * originalArticles.length)];
    
    console.log(`✓ Fetched: "${article.title}"`);
    console.log(`  ID: ${article.id}`);
    console.log(`  Length: ${article.content.length} characters`);

    return article;
  } catch (error) {
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
};

// ============================================================================
// STEP 2: Search for related articles using Serper API
// ============================================================================
const findReferenceArticles = async (title) => {
  try {
    console.log('\n🔍 STEP 2: Searching for reference articles...');
    console.log(`  Query: "${title}"`);

    const searchResults = await searchArticles(title);

    if (searchResults.length === 0) {
      throw new Error('No search results found');
    }

    console.log(`✓ Found ${searchResults.length} potential articles`);
    searchResults.forEach((result, idx) => {
      console.log(`  ${idx + 1}. ${result.title}`);
      console.log(`     ${result.url}`);
    });

    return searchResults;
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

// ============================================================================
// STEP 3: Scrape content from the search results
// ============================================================================
const scrapeReferenceContent = async (searchResults) => {
  try {
    console.log('\n🕷️  STEP 3: Scraping reference article content...');

    const referencedArticles = [];

    for (const result of searchResults) {
      try {
        console.log(`  Scraping: ${result.url}`);
        const content = await scrapeArticleContent(result.url);
        
        referencedArticles.push({
          source: result.url,
          title: result.title,
          content: content
        });

        console.log(`  ✓ Scraped ${content.length} characters`);
      } catch (error) {
        console.warn(`  ⚠ Failed to scrape ${result.url}: ${error.message}`);
      }
    }

    if (referencedArticles.length === 0) {
      throw new Error('Could not scrape any reference articles');
    }

    console.log(`✓ Successfully scraped ${referencedArticles.length} articles`);

    return referencedArticles;
  } catch (error) {
    throw new Error(`Content scraping failed: ${error.message}`);
  }
};

// ============================================================================
// STEP 4: Rewrite the article using LLM
// ============================================================================
const generateEnhancedArticle = async (originalArticle, referenceArticles) => {
  try {
    console.log('\n🤖 STEP 4: Calling LLM to rewrite article...');
    console.log(`  Model: ${process.env.LLM_MODEL || 'gemini-1.5-flash'}`);
    console.log(`  References: ${referenceArticles.length}`);

    const rewrittenContent = await rewriteArticleWithLLM(
      {
        title: originalArticle.title,
        content: originalArticle.content.substring(0, 2000) // Limit for LLM
      },
      referenceArticles
    );

    console.log(`✓ Generated article (${rewrittenContent.length} characters)`);

    return rewrittenContent;
  } catch (error) {
    throw new Error(`LLM generation failed: ${error.message}`);
  }
};

// ============================================================================
// STEP 5: Save the generated article to the API
// ============================================================================
const saveGeneratedArticle = async (originalArticle, generatedContent) => {
  try {
    console.log('\n💾 STEP 5: Saving generated article to API...');

    const payload = {
      title: `${originalArticle.title} (AI Enhanced)`,
      content: generatedContent,
      source_url: `${originalArticle.source_url}#generated`,
      type: 'generated'
    };

    const response = await axios.post(`${API_BASE_URL}/articles`, payload);

    const savedArticle = response.data.data;
    console.log(`✓ Saved! ID: ${savedArticle.id}`);
    console.log(`  Title: ${savedArticle.title}`);

    return savedArticle;
  } catch (error) {
    throw new Error(`Failed to save article: ${error.message}`);
  }
};

// ============================================================================
// MAIN: Orchestrate the entire flow
// ============================================================================
const main = async () => {
  console.log('='.repeat(70));
  console.log('🚀 AI ARTICLE ENHANCEMENT PIPELINE - PHASE 2');
  console.log('='.repeat(70));

  try {
    // Step 1: Fetch original
    const originalArticle = await fetchOriginalArticle();

    // Step 2: Search for references
    const searchResults = await findReferenceArticles(originalArticle.title);

    // Step 3: Scrape reference content
    const referenceArticles = await scrapeReferenceContent(searchResults);

    // Step 4: Generate with LLM
    const generatedContent = await generateEnhancedArticle(
      originalArticle,
      referenceArticles
    );

    // Step 5: Save to API
    const savedArticle = await saveGeneratedArticle(
      originalArticle,
      generatedContent
    );

    console.log('\n' + '='.repeat(70));
    console.log('✅ SUCCESS! Article enhancement complete');
    console.log('='.repeat(70));
    console.log(`Generated Article ID: ${savedArticle.id}`);
    console.log(`View at: GET /articles/${savedArticle.id}`);

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ PIPELINE FAILED');
    console.error('='.repeat(70));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(70));

    process.exit(1);
  }
};

main();
