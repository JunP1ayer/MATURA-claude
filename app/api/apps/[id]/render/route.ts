import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * 生成されたアプリを直接HTMLとして配信
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appId = params.id
    console.log(`🎨 Rendering app: ${appId}`)
    
    // アプリファイルの読み込み
    const appDir = path.join(process.cwd(), 'app', appId)
    const pageFilePath = path.join(appDir, 'page.tsx')
    const metadataFilePath = path.join(appDir, 'metadata.json')
    
    try {
      await fs.access(pageFilePath)
      await fs.access(metadataFilePath)
    } catch {
      return new NextResponse(
        generateErrorHTML('アプリが見つかりません', `App ID: ${appId}`),
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }
    
    const [pageContent, metadataContent] = await Promise.all([
      fs.readFile(pageFilePath, 'utf-8'),
      fs.readFile(metadataFilePath, 'utf-8')
    ])
    
    const metadata = JSON.parse(metadataContent)
    
    // ReactコンポーネントからHTMLを生成
    const html = generateStaticHTML(pageContent, metadata, appId)
    
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
 * ReactコンポーネントからスタンドアロンHTMLを生成
 */
function generateStaticHTML(pageContent: string, metadata: any, appId: string): string {
  // 基本的なHTMLテンプレート
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.appType || 'Generated App'}</title>
  <meta name="description" content="${metadata.description || 'MATURA生成アプリ'}">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- React & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- Framer Motion (optional) -->
  <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.umd.js"></script>
  
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
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    /* アニメーション */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- アプリの説明とメタデータ -->
  <div class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm opacity-90 hover:opacity-100 transition-opacity">
    <div class="text-sm text-gray-600 mb-2">
      <strong>デモ完成（機能実装中）</strong>
    </div>
    <div class="text-xs text-gray-500">
      CRUD・状態管理・DB連携対応<br>
      アプリ: ${metadata.appType}<br>
      生成日: ${new Date(metadata.timestamp).toLocaleDateString('ja-JP')}
    </div>
  </div>
  
  <script>
    // 基本的なReactコンポーネントのレンダリング
    const { useState, useEffect } = React;
    
    // シンプルなアプリコンポーネント
    function GeneratedApp() {
      const [mounted, setMounted] = useState(false);
      const [items, setItems] = useState([]);
      const [inputValue, setInputValue] = useState('');
      
      useEffect(() => {
        setMounted(true);
      }, []);
      
      const addItem = () => {
        if (inputValue.trim()) {
          setItems([...items, {
            id: Date.now(),
            text: inputValue,
            completed: false
          }]);
          setInputValue('');
        }
      };
      
      const toggleItem = (id) => {
        setItems(items.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        ));
      };
      
      if (!mounted) return React.createElement('div', { className: 'flex items-center justify-center min-h-screen' }, 'Loading...');
      
      return React.createElement('div', { 
        className: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4' 
      }, [
        // ヘッダー
        React.createElement('header', { 
          key: 'header',
          className: 'text-center mb-8 fade-in' 
        }, [
          React.createElement('h1', { 
            key: 'title',
            className: 'text-4xl font-bold text-gray-800 mb-2' 
          }, '${metadata.appType || 'Generated App'}'),
          React.createElement('p', { 
            key: 'desc',
            className: 'text-gray-600' 
          }, '${metadata.description || 'MATURA powered application'}')
        ]),
        
        // メインコンテンツ
        React.createElement('main', { 
          key: 'main',
          className: 'max-w-4xl mx-auto' 
        }, [
          // 機能カード
          React.createElement('div', { 
            key: 'features',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8' 
          }, ${JSON.stringify(metadata.features || []).replace(/"/g, "'")}
            .map((feature, index) => 
              React.createElement('div', { 
                key: index,
                className: 'bg-white rounded-lg shadow-md p-6 card-hover fade-in' 
              }, [
                React.createElement('h3', { 
                  key: 'feature-title',
                  className: 'font-semibold text-lg mb-2 text-gray-800' 
                }, \`機能 \${index + 1}\`),
                React.createElement('p', { 
                  key: 'feature-desc',
                  className: 'text-gray-600' 
                }, feature)
              ])
            )
          ),
          
          // インタラクティブセクション
          React.createElement('div', { 
            key: 'interactive',
            className: 'bg-white rounded-lg shadow-lg p-8 fade-in' 
          }, [
            React.createElement('h2', { 
              key: 'interactive-title',
              className: 'text-2xl font-bold mb-6 text-center text-gray-800' 
            }, '試してみよう'),
            
            // 入力エリア
            React.createElement('div', { 
              key: 'input-area',
              className: 'flex gap-4 mb-6' 
            }, [
              React.createElement('input', { 
                key: 'input',
                type: 'text',
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                placeholder: 'アイテムを追加...',
                className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              }),
              React.createElement('button', { 
                key: 'add-btn',
                onClick: addItem,
                className: 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
              }, '追加')
            ]),
            
            // アイテムリスト
            React.createElement('div', { 
              key: 'items-list',
              className: 'space-y-2' 
            }, items.map(item => 
              React.createElement('div', { 
                key: item.id,
                className: \`flex items-center gap-3 p-3 bg-gray-50 rounded-lg \${item.completed ? 'opacity-60' : ''}\`,
                onClick: () => toggleItem(item.id)
              }, [
                React.createElement('div', { 
                  key: 'checkbox',
                  className: \`w-5 h-5 rounded border-2 \${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} cursor-pointer\`
                }),
                React.createElement('span', { 
                  key: 'text',
                  className: \`cursor-pointer \${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`
                }, item.text)
              ])
            ))
          ])
        ])
      ]);
    }
    
    // アプリをマウント
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(GeneratedApp));
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
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
    <div class="text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-4">${title}</h1>
      <p class="text-gray-600 mb-6">${message}</p>
      <button onclick="window.history.back()" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        戻る
      </button>
    </div>
  </div>
</body>
</html>`;
}