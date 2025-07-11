// Modern UI Generator のテスト
const { generateModernUI } = require('./lib/modern-ui-generator.ts')

// テスト用の要件
const testRequirements = {
  appType: 'タスク管理アプリ',
  description: 'シンプルで使いやすいタスク管理システム',
  features: ['タスク作成', '完了マーク', '進捗表示', 'カテゴリ分け'],
  theme: 'modern',
  primaryColor: '#3B82F6',
  category: 'productivity'
}

try {
  console.log('🧪 Testing Modern UI Generator...')
  const modernCode = generateModernUI(testRequirements)
  
  console.log('✅ Modern UI generated successfully!')
  console.log('📊 Code length:', modernCode.length, 'characters')
  console.log('🎨 Contains modern features:')
  console.log('  - Gradient backgrounds:', modernCode.includes('gradient-to-br'))
  console.log('  - Motion animations:', modernCode.includes('motion.'))
  console.log('  - Backdrop blur:', modernCode.includes('backdrop-blur'))
  console.log('  - Glass effect:', modernCode.includes('bg-white/80'))
  console.log('  - Modern layout:', modernCode.includes('sticky top-0'))
  
  // 保存してテスト
  const fs = require('fs')
  fs.writeFileSync('./app/test-modern-output/page.tsx', modernCode)
  console.log('💾 Saved to app/test-modern-output/page.tsx')
  
} catch (error) {
  console.error('❌ Modern UI generation failed:', error)
}