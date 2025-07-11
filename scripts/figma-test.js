#!/usr/bin/env node

// Figma API テストスクリプト
// 使用方法: node scripts/figma-test.js [file-id]

const https = require('https');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.FIGMA_API_KEY;
const FILE_ID = process.argv[2] || process.env.DEFAULT_FIGMA_FILE_ID || 'hGTLJn3UWQPmyB6ns5Eo0k';

console.log('🎨 Figma API テスト開始...');
console.log(`📁 File ID: ${FILE_ID}`);
console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : '未設定'}`);
console.log('');

if (!API_KEY || API_KEY.includes('your-')) {
  console.error('❌ エラー: 有効なAPIキーが設定されていません');
  console.log('→ .env.local に FIGMA_API_KEY を設定してください');
  process.exit(1);
}

// テスト1: ファイルアクセス
const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${FILE_ID}`,
  method: 'GET',
  headers: {
    'X-Figma-Token': API_KEY
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const result = JSON.parse(data);
    
    if (res.statusCode === 200) {
      console.log('✅ 成功: Figma APIにアクセスできました！');
      console.log(`📄 ファイル名: ${result.name}`);
      console.log(`📅 最終更新: ${result.lastModified}`);
      console.log(`👤 権限: ${result.role || 'viewer'}`);
      console.log('');
      console.log('✨ Figma連携の準備が整いました！');
      console.log('→ MATURAでアプリ生成を試してください');
    } else {
      console.error(`❌ エラー: ${res.statusCode} ${result.err || 'Unknown error'}`);
      console.log('');
      
      if (res.statusCode === 403) {
        console.log('💡 解決方法:');
        console.log('1. APIキーが正しいか確認');
        console.log('2. ファイルが存在するか確認');
        console.log('3. ファイルを共有設定に: Share > Anyone with link > Can view');
        console.log('');
        console.log('📋 テスト用パブリックファイル:');
        console.log('- hGTLJn3UWQPmyB6ns5Eo0k (Google Material Design)');
        console.log('- 使用例: node scripts/figma-test.js hGTLJn3UWQPmyB6ns5Eo0k');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ネットワークエラー:', error.message);
});

req.end();