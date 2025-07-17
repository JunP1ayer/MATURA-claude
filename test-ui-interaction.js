#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testFreeTalkUI() {
  let browser;
  try {
    console.log('🚀 Starting browser automation test...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      console.log(`📺 BROWSER LOG: ${text}`);
    });
    
    // Set up error logging
    page.on('pageerror', error => {
      console.error('❌ PAGE ERROR:', error.message);
      logs.push(`PAGE ERROR: ${error.message}`);
    });
    
    // Set up network request logging
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        console.log(`🌐 API REQUEST: ${request.method()} ${request.url()}`);
        console.log(`🌐 REQUEST BODY: ${request.postData()}`);
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/chat')) {
        console.log(`🌐 API RESPONSE: ${response.status()} ${response.url()}`);
        response.text().then(text => {
          console.log(`🌐 RESPONSE BODY: ${text}`);
        }).catch(() => {
          console.log('🌐 RESPONSE BODY: Could not read response text');
        });
      }
    });
    
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('📄 Page loaded, taking screenshot...');
    await page.screenshot({ path: 'initial-page.png', fullPage: true });
    
    // Wait for the FreeTalk component to be visible
    console.log('⏳ Waiting for FreeTalk component...');
    await page.waitForSelector('textarea[placeholder*="アイデアを入力"]', { timeout: 10000 });
    
    console.log('✅ FreeTalk component found!');
    
    // Check debug panel
    const debugPanel = await page.$('.bg-yellow-100');
    if (debugPanel) {
      const debugText = await page.evaluate(el => el.textContent, debugPanel);
      console.log('🔍 Debug panel content:', debugText);
    }
    
    // Type the message
    console.log('⌨️ Typing message: こんにちは');
    await page.focus('textarea[placeholder*="アイデアを入力"]');
    await page.type('textarea[placeholder*="アイデアを入力"]', 'こんにちは');
    
    // Wait a moment for the button to become enabled
    await page.waitForTimeout(500);
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'before-send.png', fullPage: true });
    
    // Click send button
    console.log('🖱️ Clicking send button...');
    await page.click('button[type="submit"], button:has(svg)');
    
    // Wait for loading to start
    console.log('⏳ Waiting for loading state...');
    await page.waitForTimeout(1000);
    
    // Take screenshot during loading
    await page.screenshot({ path: 'during-loading.png', fullPage: true });
    
    // Wait for the response - check for either success or error
    console.log('⏳ Waiting for AI response...');
    try {
      // Wait for either a new message or an error to appear
      await Promise.race([
        page.waitForFunction(() => {
          const conversations = document.querySelectorAll('[data-role="user"], [data-role="assistant"]');
          return conversations.length >= 2; // At least user message + AI response
        }, { timeout: 30000 }),
        page.waitForSelector('.text-red-600', { timeout: 30000 }), // Error message
        page.waitForFunction(() => {
          // Check if debug panel shows error
          const debugPanel = document.querySelector('.bg-yellow-100');
          return debugPanel && debugPanel.textContent.includes('Error:') && !debugPanel.textContent.includes('Error: None');
        }, { timeout: 30000 })
      ]);
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for response, taking screenshot...');
      await page.screenshot({ path: 'timeout-state.png', fullPage: true });
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-state.png', fullPage: true });
    
    // Get final state
    const finalState = await page.evaluate(() => {
      const debugPanel = document.querySelector('.bg-yellow-100');
      const errorMessage = document.querySelector('.text-red-600');
      const messages = document.querySelectorAll('[data-role]');
      const loadingSpinner = document.querySelector('.animate-spin');
      
      return {
        debugPanel: debugPanel ? debugPanel.textContent : 'No debug panel',
        errorMessage: errorMessage ? errorMessage.textContent : 'No error message',
        messageCount: messages.length,
        isLoading: !!loadingSpinner,
        messages: Array.from(messages).map(msg => ({
          role: msg.getAttribute('data-role'),
          content: msg.textContent.substring(0, 100) + '...'
        }))
      };
    });
    
    console.log('📊 Final UI state:');
    console.log('  Debug panel:', finalState.debugPanel);
    console.log('  Error message:', finalState.errorMessage);
    console.log('  Message count:', finalState.messageCount);
    console.log('  Is loading:', finalState.isLoading);
    console.log('  Messages:', finalState.messages);
    
    console.log('📋 Console logs captured:');
    logs.forEach(log => console.log('  ', log));
    
    console.log('🌐 API requests made:');
    apiRequests.forEach(req => console.log('  ', req.method, req.url, req.postData));
    
    console.log('✅ Browser test completed!');
    
  } catch (error) {
    console.error('❌ Browser test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testFreeTalkUI().catch(console.error);