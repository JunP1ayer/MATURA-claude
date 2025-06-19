// 空のリクエストボディ問題の直接テスト
const testEmptyBodyIssue = async () => {
  console.log('=== Empty Body Issue Test ===');
  
  // 1. APIの基本動作確認
  console.log('1. Testing API with valid body...');
  const response1 = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "テスト",
      messages: [],
      phase: "FreeTalk"
    })
  });
  console.log('API Response:', response1.status, await response1.text());
  
  // 2. 空のボディでテスト
  console.log('\n2. Testing with empty body...');
  const response2 = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ''
  });
  console.log('Empty body response:', response2.status, await response2.text());
  
  // 3. bodyなしでテスト
  console.log('\n3. Testing without body property...');
  const response3 = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('No body response:', response3.status, await response3.text());
};

testEmptyBodyIssue().catch(console.error);
