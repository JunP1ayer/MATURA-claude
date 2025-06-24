#!/usr/bin/env node

const http = require('http');

// First, let's create a simple test to send a message to the chat API
async function testChatAPI() {
  console.log('🧪 Testing FreeTalk Chat API...');
  
  const postData = JSON.stringify({
    message: 'こんにちは',
    phase: 'FreeTalk'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`🌐 Response Status: ${res.statusCode}`);
      console.log(`🌐 Response Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('🌐 Response Body:', data);
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          console.log('❌ Failed to parse JSON response:', e.message);
          resolve({ error: 'Invalid JSON', raw: data });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request error: ${e.message}`);
      reject(e);
    });

    console.log('📤 Sending request:', postData);
    req.write(postData);
    req.end();
  });
}

// Test the API
testChatAPI().then(result => {
  console.log('✅ Test completed');
  console.log('📋 Final result:', JSON.stringify(result, null, 2));
}).catch(error => {
  console.error('❌ Test failed:', error);
});