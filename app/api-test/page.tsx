'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/structure-autofill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: input })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('API Error:', error)
      setResult({ error: 'API呼び出しに失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">構造化自動入力API テスト</h1>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            アイデアを入力してください：
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例：カフェのWebサイトを作りたい"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={testApi}
          disabled={!input || loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? '構造化中...' : '構造化実行'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">結果：</h2>
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div>
              <p className="mb-2"><strong>入力:</strong> {result.data?.userInput}</p>
              <p className="mb-2"><strong>抽象度:</strong> {result.data?.isAbstract ? '抽象的' : '具体的'}</p>
              <div className="mb-4">
                <h3 className="font-bold mb-2">構造化結果:</h3>
                <div className="bg-white p-4 rounded border">
                  <p className="mb-2"><strong>Why:</strong> {result.data?.structure?.why}</p>
                  <p className="mb-2"><strong>Who:</strong> {result.data?.structure?.who}</p>
                  <p className="mb-2"><strong>What:</strong> [{result.data?.structure?.what?.join(', ')}]</p>
                  <p className="mb-2"><strong>How:</strong> {result.data?.structure?.how}</p>
                  <p className="mb-2"><strong>Impact:</strong> {result.data?.structure?.impact}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">テスト用サンプル入力:</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            'カフェのWebサイトを作りたい',
            'オンラインショップを作りたい',
            'ブログサイトを作りたい',
            'ニュースサイトを作りたい',
            'コミュニティサイトを作りたい',
            'フィットネスジムのサイトを作りたい',
            '学園祭のサイトを作りたい',
            '日記アプリを作りたい'
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => setInput(sample)}
              className="p-2 text-left bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}