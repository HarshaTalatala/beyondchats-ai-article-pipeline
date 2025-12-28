import 'dotenv/config';
import { enhanceArticle, getRandomOriginalArticle } from '../services/aiEnhancerService.js';

const main = async () => {
  console.log('='.repeat(70));
  console.log('🚀 AI ARTICLE ENHANCEMENT PIPELINE - PHASE 2');
  console.log('='.repeat(70));

  try {
    const originalArticle = await getRandomOriginalArticle();
    console.log(`\n📖 Selected original article: ${originalArticle.title} (ID: ${originalArticle.id})`);

    const savedArticle = await enhanceArticle(originalArticle);

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
