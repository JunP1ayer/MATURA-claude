export default function UIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MATURAのUIスタイル選択
          </h1>
          <p className="text-lg text-gray-600">
            美しいUIデザインテンプレートからお選びください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Modern Gradient Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">Modern</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <div className="h-2 bg-white/60 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-white/40 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Gradient</h3>
              <p className="text-gray-600 text-sm mb-4">
                洗練されたグラデーションと柔らかな影で、現代的で親しみやすい印象
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">親しみやすい</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">モダン</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          {/* Minimal Zen Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gray-50 relative border-b">
              <div className="absolute top-4 left-4 bg-black text-white rounded px-3 py-1">
                <span className="text-sm font-medium">Minimal</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="space-y-3">
                  <div className="h-3 bg-black w-1/3"></div>
                  <div className="h-1 bg-gray-300 w-full"></div>
                  <div className="h-1 bg-gray-300 w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Minimal Zen</h3>
              <p className="text-gray-600 text-sm mb-4">
                余白を活かしたミニマルデザイン。無駄を省き、本質に集中できる美しさ
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">シンプル</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">洗練</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          {/* Luxury Dark Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gray-900 relative">
              <div className="absolute top-4 left-4 bg-yellow-500 text-black rounded px-3 py-1">
                <span className="text-sm font-medium">Luxury</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="h-2 bg-yellow-500 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Luxury Dark</h3>
              <p className="text-gray-600 text-sm mb-4">
                プレミアム感溢れるダークテーマ。金のアクセントが高級感を演出
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">高級感</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">プレミアム</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          {/* Creative Vibrant Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative">
              <div className="absolute top-4 left-4 bg-white text-red-600 rounded px-3 py-1">
                <span className="text-sm font-medium">Creative</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <div className="h-2 bg-white/80 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-white/60 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Creative Vibrant</h3>
              <p className="text-gray-600 text-sm mb-4">
                鮮やかな色彩とダイナミックな要素で創造性とエネルギーを表現
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">創造的</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">エネルギッシュ</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-cyan-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          {/* Professional Corporate Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-blue-600 relative">
              <div className="absolute top-4 left-4 bg-white text-blue-600 rounded px-3 py-1">
                <span className="text-sm font-medium">Professional</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <div className="h-2 bg-white/80 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-white/60 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Corporate</h3>
              <p className="text-gray-600 text-sm mb-4">
                ビジネスシーンに最適な、信頼性と専門性を重視したデザイン
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">信頼性</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">専門性</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          {/* Glass Morphism Style */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
              <div className="absolute top-2 left-2 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white rounded px-3 py-1">
                <span className="text-sm font-medium">Glass</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3">
                  <div className="h-2 bg-white/60 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-white/40 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Glass Morphism</h3>
              <p className="text-gray-600 text-sm mb-4">
                ガラスのような透明感と奥行きで、未来的で洗練された体験
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">未来的</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">洗練</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  )
}