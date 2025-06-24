export default function UIFinalPage() {
  const softCardsSVG = `
    <svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="softBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fce7f3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f3e8ff;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="softCard" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#softBg)"/>
      
      <!-- Header -->
      <text x="150" y="50" text-anchor="middle" fill="#ec4899" font-family="Arial" font-size="18" font-weight="bold">Soft Cards</text>
      <text x="150" y="70" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="11">やさしいデザイン</text>
      
      <!-- Main Card with shadow -->
      <rect x="32" y="92" width="236" height="140" rx="20" fill="#000000" fill-opacity="0.1"/>
      <rect x="30" y="90" width="240" height="140" rx="20" fill="white"/>
      
      <!-- Card Header -->
      <rect x="45" y="105" width="210" height="4" rx="2" fill="url(#softCard)"/>
      <rect x="45" y="120" width="150" height="3" rx="1" fill="#e5e7eb"/>
      
      <!-- Avatar and content -->
      <circle cx="60" cy="150" r="12" fill="#ec4899"/>
      <rect x="80" y="142" width="100" height="3" rx="1" fill="#1f2937"/>
      <rect x="80" y="155" width="80" height="2" rx="1" fill="#6b7280"/>
      
      <!-- Input fields -->
      <rect x="45" y="175" width="210" height="15" rx="8" fill="#f9fafb" stroke="#e5e7eb"/>
      <rect x="45" y="195" width="210" height="15" rx="8" fill="#f9fafb" stroke="#e5e7eb"/>
      
      <!-- Buttons -->
      <rect x="45" y="215" width="90" height="12" rx="6" fill="url(#softCard)"/>
      <rect x="145" y="215" width="60" height="12" rx="6" fill="none" stroke="#a855f7" stroke-width="1"/>
      
      <!-- Feature Cards with shadows -->
      <rect x="42" y="262" width="60" height="60" rx="12" fill="#000000" fill-opacity="0.1"/>
      <rect x="122" y="262" width="60" height="60" rx="12" fill="#000000" fill-opacity="0.1"/>
      <rect x="202" y="262" width="60" height="60" rx="12" fill="#000000" fill-opacity="0.1"/>
      
      <rect x="40" y="260" width="60" height="60" rx="12" fill="white"/>
      <rect x="120" y="260" width="60" height="60" rx="12" fill="white"/>
      <rect x="200" y="260" width="60" height="60" rx="12" fill="white"/>
      
      <!-- Feature Icons -->
      <circle cx="70" cy="280" r="8" fill="#fce7f3"/>
      <circle cx="150" cy="280" r="8" fill="#f3e8ff"/>
      <circle cx="230" cy="280" r="8" fill="#fce7f3"/>
      
      <circle cx="70" cy="280" r="3" fill="#ec4899"/>
      <circle cx="150" cy="280" r="3" fill="#a855f7"/>
      <circle cx="230" cy="280" r="3" fill="#ec4899"/>
      
      <!-- Feature Labels -->
      <text x="70" y="305" text-anchor="middle" fill="#1f2937" font-family="Arial" font-size="8">機能1</text>
      <text x="150" y="305" text-anchor="middle" fill="#1f2937" font-family="Arial" font-size="8">機能2</text>
      <text x="230" y="305" text-anchor="middle" fill="#1f2937" font-family="Arial" font-size="8">機能3</text>
      
      <!-- Decorative elements -->
      <circle cx="270" cy="60" r="15" fill="#ec4899" fill-opacity="0.2"/>
      <circle cx="30" cy="350" r="10" fill="#a855f7" fill-opacity="0.2"/>
    </svg>
  `

  const minimalSVG = `
    <svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#f9fafb"/>
      <text x="50" y="60" fill="#000000" font-family="Arial" font-size="24" font-weight="300">Minimal</text>
      <text x="50" y="85" fill="#6b7280" font-family="Arial" font-size="14">Less is more.</text>
      <rect x="40" y="120" width="220" height="180" fill="white"/>
      <line x1="60" y1="160" x2="240" y2="160" stroke="#e5e7eb" stroke-width="1"/>
      <line x1="60" y1="200" x2="240" y2="200" stroke="#e5e7eb" stroke-width="1"/>
      <rect x="60" y="230" width="180" height="30" fill="#000000"/>
      <text x="150" y="248" text-anchor="middle" fill="white" font-family="Arial" font-size="12">Continue</text>
    </svg>
  `

  const glassSVG = `
    <svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#581c87;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#glassGrad)"/>
      <circle cx="80" cy="100" r="40" fill="#ec4899" fill-opacity="0.3"/>
      <circle cx="220" cy="300" r="50" fill="#3b82f6" fill-opacity="0.3"/>
      <text x="150" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">Glass Morphism</text>
      <rect x="40" y="100" width="220" height="120" rx="12" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.2"/>
      <rect x="60" y="130" width="180" height="15" rx="8" fill="white" fill-opacity="0.1"/>
      <rect x="60" y="150" width="180" height="15" rx="8" fill="white" fill-opacity="0.1"/>
      <rect x="60" y="180" width="180" height="20" rx="10" fill="white" fill-opacity="0.2"/>
    </svg>
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MATURAのUIスタイル選択（最終版）
          </h1>
          <p className="text-lg text-gray-600">
            美しく実用的なUIデザインテンプレートからお選びください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Soft Cards Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 relative">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: softCardsSVG }}
              />
              <div className="absolute top-4 left-4 bg-pink-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                Modern
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Soft Cards</h3>
              <p className="text-gray-600 text-sm mb-4">
                角丸で優しいグラデーション。ユーザーフレンドリーなアプリに最適。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">親しみやすい</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">モダン</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">信頼感</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-pink-200 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>

          {/* Minimal Zen Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 relative">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: minimalSVG }}
              />
              <div className="absolute top-4 left-4 bg-black text-white rounded-full px-3 py-1 text-xs font-medium">
                Minimal
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Minimal Zen</h3>
              <p className="text-gray-600 text-sm mb-4">
                余白を活かしたミニマルデザイン。無駄を省き、本質に集中できる美しさ。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">シンプル</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">洗練</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">集中</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>

          {/* Glass Morphism Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 relative">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: glassSVG }}
              />
              <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                Futuristic
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Glass Morphism</h3>
              <p className="text-gray-600 text-sm mb-4">
                ガラスのような透明感と奥行きで、未来的で洗練された体験を提供。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">未来的</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">洗練</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">革新</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>

          {/* Luxury Dark Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 bg-gray-900 relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-yellow-500 text-3xl font-bold mb-2">LUXURY</div>
                <div className="text-gray-300 text-sm mb-4">プレミアム体験</div>
                <div className="bg-gray-800 rounded-lg p-4 mx-4">
                  <div className="h-2 bg-yellow-500 rounded mb-2"></div>
                  <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-yellow-500 text-black rounded-full px-3 py-1 text-xs font-medium">
                Luxury
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Luxury Dark</h3>
              <p className="text-gray-600 text-sm mb-4">
                プレミアム感溢れるダークテーマ。金のアクセントが高級感を演出。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">高級感</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">プレミアム</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">特別感</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>

          {/* Professional Corporate Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 bg-blue-600 relative flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-semibold mb-2">PROFESSIONAL</div>
                <div className="text-blue-100 text-sm mb-4">ビジネス向けデザイン</div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4 mx-4">
                  <div className="h-2 bg-white/80 rounded mb-2"></div>
                  <div className="h-2 bg-white/60 rounded w-3/4"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white text-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                Business
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Corporate</h3>
              <p className="text-gray-600 text-sm mb-4">
                ビジネスシーンに最適な、信頼性と専門性を重視したデザイン。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">信頼性</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">専門性</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">安定感</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>

          {/* Creative Vibrant Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-64 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">CREATIVE</div>
                <div className="text-red-100 text-sm mb-4">クリエイティブデザイン</div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4 mx-4">
                  <div className="h-2 bg-white/80 rounded mb-2"></div>
                  <div className="h-2 bg-white/60 rounded w-2/3"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white text-red-600 rounded-full px-3 py-1 text-xs font-medium">
                Creative
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Creative Vibrant</h3>
              <p className="text-gray-600 text-sm mb-4">
                鮮やかな色彩とダイナミックな要素で創造性とエネルギーを表現。
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">創造的</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">エネルギッシュ</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">革新的</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow" title="Primary"></div>
                <div className="w-6 h-6 bg-cyan-500 rounded-full border-2 border-white shadow" title="Secondary"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow" title="Accent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              お気に入りのスタイルは見つかりましたか？
            </h2>
            <p className="text-gray-600 mb-6">
              各スタイルをクリックして詳細を確認し、MATURAでのアプリケーション構築を開始しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/ui-test"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
              >
                詳細テストページ
              </a>
              <a 
                href="/"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ホームに戻る
              </a>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✨ MATURAのUIスタイル選択機能 - 美しく実用的なデザインテンプレート</p>
          <p>各スタイルはshadcn/ui + Tailwind CSSで実装されています</p>
        </div>
      </div>
    </div>
  )
}