'use client'

import ThemeCapture from '@/components/ThemeCapture'

export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            shadcn/ui テーマ比較
          </h1>
          <p className="text-lg text-gray-600">
            3つの異なるスタイルテーマの視覚的比較
          </p>
        </div>
        <ThemeCapture />
      </div>
    </main>
  )
}