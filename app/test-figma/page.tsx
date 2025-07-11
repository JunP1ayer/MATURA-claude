'use client'

import FigmaIntegrationTest from '@/components/FigmaIntegrationTest'

export default function TestFigmaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Figma Integration Test
          </h1>
          <p className="text-gray-600 text-lg">
            Test the Figma API integration and app generation functionality
          </p>
        </div>

        <FigmaIntegrationTest />
      </div>
    </div>
  )
}