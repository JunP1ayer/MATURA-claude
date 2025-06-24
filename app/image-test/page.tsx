export default function ImageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">画像テスト</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Soft Cards Original */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Soft Cards (Original SVG)</h3>
            <img 
              src="/ui_samples/soft-cards.svg" 
              alt="Soft Cards"
              className="w-full h-48 object-cover rounded border"
            />
          </div>

          {/* Soft Cards Simple */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Soft Cards (Simple SVG)</h3>
            <img 
              src="/ui_samples/soft-cards-simple.svg" 
              alt="Soft Cards Simple"
              className="w-full h-48 object-cover rounded border"
            />
          </div>

          {/* Flat Minimal */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Flat Minimal</h3>
            <img 
              src="/ui_samples/flat-minimal.svg" 
              alt="Flat Minimal"
              className="w-full h-48 object-cover rounded border"
            />
          </div>

          {/* Glass UI */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Glass UI</h3>
            <img 
              src="/ui_samples/glass-ui.svg" 
              alt="Glass UI"
              className="w-full h-48 object-cover rounded border"
            />
          </div>

          {/* Notion Style */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Notion Style</h3>
            <img 
              src="/ui_samples/notion-style.svg" 
              alt="Notion Style"
              className="w-full h-48 object-cover rounded border"
            />
          </div>

          {/* Chat AI */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Chat AI</h3>
            <img 
              src="/ui_samples/chat-ai.svg" 
              alt="Chat AI"
              className="w-full h-48 object-cover rounded border"
            />
          </div>
        </div>

        {/* Direct SVG Embed Test */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">直接SVG埋め込みテスト</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="w-64 h-64 border rounded">
              <svg width="100%" height="100%" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="400" fill="#fce7f3"/>
                <text x="150" y="40" textAnchor="middle" fill="#ec4899" fontFamily="Arial" fontSize="20" fontWeight="bold">Soft Cards</text>
                <rect x="30" y="70" width="240" height="140" rx="20" fill="white"/>
                <rect x="45" y="85" width="210" height="4" rx="2" fill="#ec4899"/>
                <circle cx="60" cy="130" r="12" fill="#ec4899"/>
                <rect x="40" y="240" width="60" height="60" rx="10" fill="white"/>
                <rect x="120" y="240" width="60" height="60" rx="10" fill="white"/>
                <rect x="200" y="240" width="60" height="60" rx="10" fill="white"/>
                <circle cx="70" cy="260" r="8" fill="#fce7f3"/>
                <circle cx="150" cy="260" r="8" fill="#f3e8ff"/>
                <circle cx="230" cy="260" r="8" fill="#fce7f3"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
        </div>
      </div>
    </div>
  )
}