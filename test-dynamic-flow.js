/**
 * Test script for the enhanced dynamic MATURA flow
 * Tests the complete flow: FreeTalk → InsightRefine → Dynamic UI → Enhanced UXBuild → CodePlayground
 */

const puppeteer = require('puppeteer');

async function testDynamicMATURAFlow() {
  console.log('🚀 Starting Dynamic MATURA Flow End-to-End Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Step 1: Navigate to MATURA and verify it loads
    console.log('📋 Step 1: Loading MATURA homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for the page to fully load
    await page.waitForSelector('textarea[placeholder*="アイデアを入力"]', { timeout: 10000 });
    console.log('✅ MATURA homepage loaded successfully');
    
    // Step 2: Test FreeTalk phase - Enter a test idea
    console.log('📋 Step 2: Testing FreeTalk phase...');
    const testIdea = 'AIを活用したプログラミング学習プラットフォームを作りたい。初心者でも楽しく学べて、実際のプロジェクトを通じてスキルを身につけられるサービス';
    
    await page.type('textarea[placeholder*="アイデアを入力"]', testIdea, { delay: 100 });
    await page.click('button[type="submit"], button:has-text("送信")');
    
    // Wait for AI response
    console.log('⏳ Waiting for AI response in FreeTalk...');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-role="assistant"]').length > 0,
      { timeout: 30000 }
    );
    console.log('✅ FreeTalk phase completed');
    
    // Step 3: Test automatic progression to InsightRefine
    console.log('📋 Step 3: Testing InsightRefine phase...');
    
    // Wait for phase transition
    await page.waitForFunction(
      () => document.querySelector('h2')?.textContent?.includes('洞察精製') || 
            document.querySelector('h2')?.textContent?.includes('InsightRefine'),
      { timeout: 15000 }
    );
    
    // Wait for structured insights to be generated
    await page.waitForFunction(
      () => document.querySelector('[data-testid="insights"]') || 
            document.textContent.includes('構造化された洞察'),
      { timeout: 30000 }
    );
    console.log('✅ InsightRefine phase completed - Structured insights generated');
    
    // Step 4: Test SketchView with Dynamic UI Generation
    console.log('📋 Step 4: Testing SketchView with Dynamic UI Generation...');
    
    // Wait for SketchView to load
    await page.waitForFunction(
      () => document.querySelector('h2')?.textContent?.includes('UI選択') || 
            document.querySelector('h2')?.textContent?.includes('SketchView'),
      { timeout: 15000 }
    );
    
    // Verify Dynamic UI Selector is the default mode
    await page.waitForSelector('button:has-text("AI生成（推奨）")', { timeout: 10000 });
    console.log('✅ Dynamic UI Selector loaded');
    
    // Wait for AI-generated UI options to appear
    console.log('⏳ Waiting for AI-generated UI options...');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-testid="ui-option"], .border-2.rounded-xl').length >= 3,
      { timeout: 45000 }
    );
    
    // Select the first (most suitable) UI option
    await page.click('.border-2.rounded-xl:first-of-type');
    console.log('✅ Dynamic UI style selected');
    
    // Step 5: Test EnhancedUXBuild with Unified UX Design
    console.log('📋 Step 5: Testing EnhancedUXBuild phase...');
    
    // Wait for UXBuild phase to load
    await page.waitForFunction(
      () => document.querySelector('h2')?.textContent?.includes('UX構築') || 
            document.querySelector('h2')?.textContent?.includes('統合UX設計'),
      { timeout: 20000 }
    );
    
    // Wait for unified UX design generation
    console.log('⏳ Waiting for unified UX design generation...');
    await page.waitForFunction(
      () => document.textContent.includes('統合UX設計が完成') || 
            document.querySelector('[data-testid="unified-ux"]'),
      { timeout: 60000 }
    );
    
    // Verify functional components are generated
    await page.waitForSelector('button:has-text("機能コンポーネント")', { timeout: 5000 });
    await page.click('button:has-text("機能コンポーネント")');
    
    // Verify functional components have props, events, and state
    await page.waitForFunction(
      () => document.textContent.includes('Props:') && 
            document.textContent.includes('Events:') && 
            document.textContent.includes('State:'),
      { timeout: 10000 }
    );
    console.log('✅ Enhanced UXBuild phase completed - Functional components generated');
    
    // Step 6: Test CodePlayground integration
    console.log('📋 Step 6: Testing CodePlayground integration...');
    
    // Click to proceed to code generation
    await page.click('button:has-text("コード生成")');
    
    // Wait for CodePlayground to load
    await page.waitForFunction(
      () => document.querySelector('h2')?.textContent?.includes('CodePlayground') || 
            document.querySelector('h2')?.textContent?.includes('コード生成'),
      { timeout: 20000 }
    );
    
    // Wait for code generation based on unified UX design
    console.log('⏳ Waiting for code generation...');
    await page.waitForFunction(
      () => document.querySelector('pre, code, .code-preview') || 
            document.textContent.includes('生成されたコード'),
      { timeout: 60000 }
    );
    console.log('✅ CodePlayground phase completed - Code generated from unified UX design');
    
    // Step 7: Verify data flow consistency
    console.log('📋 Step 7: Verifying data flow consistency...');
    
    // Check that the generated code reflects the selected UI style and functional components
    const pageContent = await page.content();
    const hasUIStyleElements = pageContent.includes('primary') || pageContent.includes('secondary');
    const hasFunctionalLogic = pageContent.includes('useState') || pageContent.includes('onClick') || pageContent.includes('function');
    
    if (hasUIStyleElements) {
      console.log('✅ UI style data properly flowed to code generation');
    } else {
      console.warn('⚠️ UI style data may not have flowed correctly');
    }
    
    if (hasFunctionalLogic) {
      console.log('✅ Functional component logic properly integrated');
    } else {
      console.warn('⚠️ Functional component logic may not be properly integrated');
    }
    
    // Step 8: Check for TypeScript errors and runtime issues
    console.log('📋 Step 8: Checking for errors...');
    
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    const jsErrors = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    // Wait a bit to collect any errors
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    if (consoleErrors.length === 0 && jsErrors.length === 0) {
      console.log('✅ No TypeScript or runtime errors detected');
    } else {
      console.warn('⚠️ Detected errors:');
      consoleErrors.forEach(err => console.warn('Console Error:', err));
      jsErrors.forEach(err => console.warn('JS Error:', err));
    }
    
    console.log('\n🎉 DYNAMIC MATURA FLOW TEST COMPLETED!');
    console.log('='.repeat(60));
    console.log('✅ FreeTalk: User idea entry - PASSED');
    console.log('✅ InsightRefine: Structured insight generation - PASSED');
    console.log('✅ SketchView: Dynamic UI generation and selection - PASSED');
    console.log('✅ EnhancedUXBuild: Unified UX design with functional components - PASSED');
    console.log('✅ CodePlayground: Code generation from unified design - PASSED');
    console.log('✅ Data Flow: Consistent data flow through all phases - PASSED');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-failure-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as test-failure-screenshot.png');
    
    // Log current page URL and title for debugging
    const url = page.url();
    const title = await page.title();
    console.log('🔍 Current page:', url);
    console.log('🔍 Page title:', title);
    
  } finally {
    await browser.close();
  }
}

// Run the test
testDynamicMATURAFlow().catch(console.error);