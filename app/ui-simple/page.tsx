'use client'

import React, { useState } from 'react'

// Simple UI selection without complex dependencies
export default function UISimplePage() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const styles = [
    { id: 'soft', name: 'Soft Cards', description: '丸み、ふんわり影、優しい雰囲気' },
    { id: 'minimal', name: 'Flat Minimal', description: '角なし、余白多め、ミニマル' },
    { id: 'glass', name: 'Glass UI', description: '背景ぼかし、ガラス風、暗め背景' },
    { id: 'notion', name: 'Notion Style', description: '白背景、タイポ中心、余白広め' },
    { id: 'chat', name: 'Chat AI', description: 'LINE風チャットUI、入力欄が下部に固定' }
  ]

  if (selectedStyle) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">UIスタイル選択完了！</h1>
          <p className="text-gray-600 mb-8">選択されたスタイル: {selectedStyle}</p>
          <button
            onClick={() => setSelectedStyle(null)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            もう一度選択する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">UIスタイル選択</h1>
        
        <div className="grid gap-6">
          {styles.map((style) => (
            <div 
              key={style.id}
              onClick={() => setSelectedStyle(style.name)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
              <p className="text-gray-600">{style.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-500 hover:underline">
            ← メインページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}