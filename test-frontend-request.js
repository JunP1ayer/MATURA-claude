// Test frontend request simulation
console.log('Testing frontend request to /api/chat...');

const testData = {
  message: "こんにちは",
  messages: [],
  phase: "FreeTalk"
};

console.log('Request data:', testData);
console.log('Serialized data:', JSON.stringify(testData));

fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});