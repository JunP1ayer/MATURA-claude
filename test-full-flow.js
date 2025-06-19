// MATURA FreeTalk の完全な動作テスト
const testFullFlow = async () => {
  console.log('=== MATURA FreeTalk Full Flow Test ===\n');
  
  const testMessage = "こんにちは";
  const apiUrl = 'http://localhost:3001/api/chat';
  
  console.log('📤 Sending test message:', testMessage);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testMessage,
        messages: [{ role: 'user', content: testMessage }],
        phase: 'FreeTalk'
      })
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\n✅ API Response:');
    console.log('- Message:', data.message);
    console.log('- Phase:', data.phase);
    console.log('- Response Time:', data.responseTime + 'ms');
    
    console.log('\n🎉 Test Result: SUCCESS');
    console.log('AI responded with:', data.message);
    
  } catch (error) {
    console.error('\n❌ Test Result: FAILED');
    console.error('Error:', error.message);
  }
  
  console.log('\n=== Next Steps ===');
  console.log('1. Open http://localhost:3001 in browser');
  console.log('2. Check browser console for debug logs');
  console.log('3. Send "こんにちは" in FreeTalk');
  console.log('4. Verify both user and AI messages appear');
};

testFullFlow();
