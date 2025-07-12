// Test script for structure autofill functionality

const { autoFillStructure, isAbstractInput } = require('./lib/structure-autofill.ts')

// Test cases
const testCases = [
  '楽しい日記アプリを作りたい',
  'ECサイトを作りたい',
  '企業のホームページを作りたい',
  'ポートフォリオサイトを作りたい',
  '学習管理システムを作りたい',
  'イベント管理アプリを作りたい',
  'ゲームを作りたい',
  '何かいい感じのものを作りたい' // Abstract case
]

console.log('=== 構造化自動入力テスト ===\n')

testCases.forEach((input, index) => {
  console.log(`テストケース ${index + 1}: "${input}"`)
  console.log(`抽象度チェック: ${isAbstractInput(input) ? '抽象的' : '具体的'}`)
  
  const result = autoFillStructure(input)
  console.log('結果:')
  console.log(`  Why: ${result.why}`)
  console.log(`  Who: ${result.who}`)
  console.log(`  What: ${result.what}`)
  console.log(`  How: ${result.how}`)
  console.log(`  Impact: ${result.impact}`)
  console.log('---\n')
})

console.log('テスト完了')