// Complete flow test with enhanced logging
const testCompleteFlow = async () => {
  console.log('=== Testing Complete Flow ===\n');
  
  const testMessage = "こんにちは";
  
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: testMessage,
        messages: [{ role: 'user', content: testMessage }],
        phase: 'FreeTalk'
      })
    });
    
    const data = await response.json();
    console.log('✅ API Response Structure:');
    console.log('- response field:', data.response);
    console.log('- message field:', data.message);
    console.log('- Keys:', Object.keys(data));
    
    if (data.response || data.message) {
      console.log('\n🎉 SUCCESS: AI responded with:', data.response || data.message);
    } else {
      console.log('\n❌ ERROR: No response content found in:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testCompleteFlow();
