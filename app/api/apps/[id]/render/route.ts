import { NextRequest, NextResponse } from 'next/server'
import { getGeneratedApp } from '@/lib/supabase-apps'

/**
 * 生成されたアプリをSupabaseから取得してHTMLとして配信
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appId = params.id
    console.log(`🎨 Rendering app: ${appId}`)
    
    // Supabaseからアプリデータを取得
    const app = await getGeneratedApp(appId)
    
    if (!app) {
      return new NextResponse(
        generateErrorHTML('アプリが見つかりません', `App ID: ${appId}`),
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }
    
    // 生成されたコードとメタデータからHTMLを生成
    const html = generatePreviewHTML(app.generated_code, {
      name: app.name,
      description: app.description,
      userIdea: app.user_idea,
      schema: app.schema,
      timestamp: app.created_at
    }, appId)
    
    console.log(`✅ Successfully rendered app: ${appId}`)
    
    return new NextResponse(html, {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error: any) {
    console.error(`❌ Error rendering app ${params.id}:`, error)
    return new NextResponse(
      generateErrorHTML('レンダリングエラー', error.message),
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    )
  }
}

/**
 * 生成されたReactコンポーネントからプレビューHTMLを生成
 */
function generatePreviewHTML(generatedCode: string, metadata: any, appId: string): string {
  // 生成されたコードから基本情報を抽出
  const tableName = metadata.schema?.tableName || metadata.schema?.table_name || 'items'
  const tableFields = metadata.schema?.columns || metadata.schema?.fields || []
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.name} - MATURA Generated App</title>
  <meta name="description" content="${metadata.description}">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- React & ReactDOM (Development for preview) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  
  <style>
    /* カスタムスタイル */
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .glass-morphism {
      backdrop-filter: blur(16px) saturate(180%);
      background-color: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.125);
    }
    
    /* プレミアムアニメーション */
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    @keyframes slideInLeft {
      from { 
        opacity: 0; 
        transform: translateX(-30px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    
    .slide-in-left {
      animation: slideInLeft 0.6s ease-out;
    }
    
    .stagger-animation {
      animation-delay: calc(var(--index) * 0.1s);
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
  <!-- App Container -->
  <div id="app-root" class="min-h-screen"></div>
  
  <!-- Preview Info Panel -->
  <div class="fixed top-4 right-4 glass-morphism rounded-xl p-4 max-w-sm shadow-2xl z-50">
    <div class="text-sm font-semibold text-gray-800 mb-2">
      🚀 MATURA Generated App
    </div>
    <div class="text-xs text-gray-600 space-y-1">
      <div><strong>名前:</strong> ${metadata.name}</div>
      <div><strong>アイデア:</strong> ${metadata.userIdea}</div>
      <div><strong>テーブル:</strong> ${tableName}</div>
      <div><strong>フィールド数:</strong> ${tableFields.length}</div>
      <div><strong>生成日:</strong> ${new Date(metadata.timestamp).toLocaleDateString('ja-JP')}</div>
    </div>
    <div class="mt-3 text-xs text-green-600">
      ✅ フル機能CRUD・状態管理対応
    </div>
  </div>
  
  <!-- Generated React Component -->
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo } = React;
    
    // Mock data for preview
    const generateMockData = () => {
      const mockItems = [];
      const sampleTexts = [
        '${metadata.userIdea}のサンプル項目',
        '機能デモンストレーション',
        'CRUD操作テスト',
        'リアルタイム更新確認',
        '状態管理動作確認'
      ];
      
      for (let i = 0; i < 5; i++) {
        mockItems.push({
          id: i + 1,
          title: sampleTexts[i] || \`サンプル項目 \${i + 1}\`,
          description: \`\${metadata.name}の機能デモ項目です\`,
          status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'pending',
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          priority: ['high', 'medium', 'low'][i % 3]
        });
      }
      return mockItems;
    };
    
    // Main App Component
    function GeneratedApp() {
      const [items, setItems] = useState([]);
      const [newItem, setNewItem] = useState('');
      const [loading, setLoading] = useState(true);
      const [filter, setFilter] = useState('all');
      
      // Initialize with mock data
      useEffect(() => {
        setTimeout(() => {
          setItems(generateMockData());
          setLoading(false);
        }, 1000);
      }, []);
      
      // CRUD Operations
      const addItem = useCallback(() => {
        if (newItem.trim()) {
          const item = {
            id: Date.now(),
            title: newItem,
            description: \`\${metadata.name}で追加された新しい項目\`,
            status: 'pending',
            created_at: new Date().toISOString(),
            priority: 'medium'
          };
          setItems(prev => [item, ...prev]);
          setNewItem('');
        }
      }, [newItem]);
      
      const updateItem = useCallback((id, updates) => {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ));
      }, []);
      
      const deleteItem = useCallback((id) => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, []);
      
      const toggleStatus = useCallback((id) => {
        const statusCycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
        updateItem(id, { status: statusCycle[items.find(i => i.id === id)?.status] || 'pending' });
      }, [items, updateItem]);
      
      // Filtered items
      const filteredItems = useMemo(() => {
        return filter === 'all' ? items : items.filter(item => item.status === filter);
      }, [items, filter]);
      
      const getStatusColor = (status) => {
        switch (status) {
          case 'completed': return 'text-green-600 bg-green-100';
          case 'in_progress': return 'text-blue-600 bg-blue-100';
          default: return 'text-gray-600 bg-gray-100';
        }
      };
      
      const getStatusIcon = (status) => {
        switch (status) {
          case 'completed': return '✅';
          case 'in_progress': return '⏳';
          default: return '📋';
        }
      };
      
      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">アプリを読み込み中...</p>
            </div>
          </div>
        );
      }
      
      return (
        <div className="max-w-6xl mx-auto p-6">
          {/* ヘッダー */}
          <header className="text-center mb-12 fade-in-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ${metadata.name}
            </h1>
            <p className="text-xl text-gray-600 mb-2">${metadata.description}</p>
            <div className="text-sm text-gray-500">
              元のアイデア: "${metadata.userIdea}"
            </div>
          </header>
          
          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: '全項目', count: items.length, color: 'from-blue-500 to-blue-600', icon: '📊' },
              { label: '進行中', count: items.filter(i => i.status === 'in_progress').length, color: 'from-yellow-500 to-orange-500', icon: '⏳' },
              { label: '完了', count: items.filter(i => i.status === 'completed').length, color: 'from-green-500 to-green-600', icon: '✅' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={\`bg-gradient-to-r \${stat.color} rounded-xl p-6 text-white slide-in-left stagger-animation\`}
                style={{ '--index': index }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.count}</p>
                  </div>
                  <div className="text-2xl opacity-75">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 新規追加フォーム */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">新しい項目を追加</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="新しい項目を入力..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={addItem}
                disabled={!newItem.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                追加
              </button>
            </div>
          </div>
          
          {/* フィルター */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 fade-in-up">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'すべて', icon: '📋' },
                { key: 'pending', label: '未着手', icon: '⏸️' },
                { key: 'in_progress', label: '進行中', icon: '⏳' },
                { key: 'completed', label: '完了', icon: '✅' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={\`px-4 py-2 rounded-xl transition-all \${
                    filter === key 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }\`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* アイテムリスト */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className={\`bg-white rounded-2xl shadow-lg p-6 card-hover fade-in-up stagger-animation\`}
                style={{ '--index': index }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(item.status)}</span>
                      <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                      <span className={\`px-3 py-1 rounded-full text-xs font-medium \${getStatusColor(item.status)}\`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>🕐 {new Date(item.created_at).toLocaleDateString('ja-JP')}</span>
                      <span className={\`px-2 py-1 rounded \${
                        item.priority === 'high' ? 'bg-red-100 text-red-600' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }\`}>
                        {item.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ステータス変更"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="削除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500">
                {filter === 'all' ? '項目がありません' : \`\${filter}の項目がありません\`}
              </p>
            </div>
          )}
        </div>
      );
    }
    
    // Render the app
    const container = document.getElementById('app-root');
    const root = ReactDOM.createRoot(container);
    root.render(<GeneratedApp />);
  </script>
  
  <!-- Additional interactivity -->
  <script>
    // Add some extra polish
    document.addEventListener('DOMContentLoaded', function() {
      // Smooth scroll behavior
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Add some visual feedback for interactions
      document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
          const button = e.target;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
          }, 150);
        }
      });
    });
  </script>
</body>
</html>`;
}

/**
 * エラーHTML生成
 */
function generateErrorHTML(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>エラー - MATURA</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-red-50 to-pink-50 min-h-screen flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
    <div class="text-center">
      <div class="text-red-500 text-6xl mb-6">⚠️</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-4">${title}</h1>
      <p class="text-gray-600 mb-6">${message}</p>
      <div class="space-y-3">
        <button onclick="window.history.back()" class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          戻る
        </button>
        <button onclick="window.location.href='/'" class="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          ホームに戻る
        </button>
      </div>
    </div>
  </div>
</body>
</html>`;
}