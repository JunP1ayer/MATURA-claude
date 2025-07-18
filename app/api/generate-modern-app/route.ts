import { NextRequest, NextResponse } from 'next/server'

// 🎯 モダンアプリ生成の型定義
interface ModernAppRequest {
  insights: {
    vision: string
    target: string
    features: string[]
    value: string
    appName?: string
    description?: string
    motivation?: string
  }
  uiStyle: {
    name: string
    primaryColor: string
    accentColor: string
    secondaryColor?: string
    personality?: string[]
    colors?: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
  }
  uxDesign?: {
    layout?: {
      principles: string[]
      structure: string
    }
    colorScheme?: {
      guidelines: string[]
      accessibility: string
    }
    navigation?: {
      strategy: string[]
      userFlow: string
    }
    typography?: {
      guidelines: string[]
      hierarchy: string
    }
    animations?: {
      principles: string[]
      interactions: string
    }
  }
  selectedTopPageDesign?: {
    name: string
    description: string
    layout: string
    components: string[]
  }
  // 🚀 UX構築フェーズの詳細データを追加
  uxStructure?: {
    siteArchitecture: {
      topPage: { purpose: string; elements: string[] }
      mainFeatures: { name: string; description: string; uiElements: string[] }[]
      userFlow: string[]
    }
    designSystem: {
      layout: string
      colorUsage: { primary: string; secondary: string; accent: string; usage: string }
      typography: { heading: string; body: string; accent: string }
      spacing: string
      interactions: string[]
    }
    keyScreens: {
      name: string
      purpose: string
      components: string[]
      userAction: string
    }[]
  }
}

// 🎨 UX構築データ活用エンジン
class UXStructureCodeGenerator {
  /**
   * UX構築フェーズのデータを完全に活用してWebアプリを生成
   */
  static async generateFromUXStructure(
    insights: ModernAppRequest['insights'],
    uiStyle: ModernAppRequest['uiStyle'], 
    uxStructure: ModernAppRequest['uxStructure']
  ): Promise<string> {
    
    console.log('🎯 [UXStructureCodeGenerator] UX構築データを詳細分析中...')
    
    if (!uxStructure) {
      console.warn('⚠️ UX構築データが不足 - フォールバック生成を実行')
      return this.generateFallbackApp(insights, uiStyle)
    }

    const appName = insights.appName || this.extractAppName(insights.vision)
    const colors = this.buildColorSystem(uiStyle)
    
    console.log('🔧 [UXStructureCodeGenerator] アプリ構造:', {
      topPageElements: uxStructure.siteArchitecture?.topPage?.elements,
      mainFeatures: uxStructure.siteArchitecture?.mainFeatures?.length,
      keyScreens: uxStructure.keyScreens?.length
    })

    // UX構築データに基づく詳細なHTMLを生成
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} - ${insights.vision}</title>
    <meta name="description" content="${insights.value}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        ${this.generateUXBasedCSS(colors, uxStructure)}
    </style>
</head>
<body class="bg-gray-50" style="color: ${colors.text}">
    <div id="app" class="min-h-screen">
        ${this.generateUXBasedNavigation(uxStructure, colors, appName)}
        ${this.generateUXBasedMainContent(insights, uxStructure, colors)}
        ${this.generateUXBasedModals(uxStructure, colors)}
    </div>
    
    <script>
        ${this.generateUXBasedJavaScript(insights, uxStructure, colors)}
    </script>
</body>
</html>`
  }

  /**
   * UX構築データに基づくカスタムCSS生成
   */
  private static generateUXBasedCSS(colors: any, uxStructure: any): string {
    const interactions = uxStructure?.designSystem?.interactions || []
    
    return `
        :root {
            --primary-color: ${colors.primary};
            --secondary-color: ${colors.secondary};
            --accent-color: ${colors.accent};
            --background-color: ${colors.background};
            --text-color: ${colors.text};
        }
        
        /* UX構築で指定されたインタラクション */
        ${interactions.includes('スムーズなホバー効果') ? `
        .hover-smooth {
            transition: all 0.3s ease;
        }
        .hover-smooth:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        ` : ''}
        
        ${interactions.includes('フェードトランジション') ? `
        .fade-transition {
            transition: opacity 0.3s ease-in-out;
        }
        ` : ''}
        
        ${interactions.includes('マイクロアニメーション') ? `
        @keyframes pulse-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        .micro-animation {
            animation: pulse-gentle 2s infinite;
        }
        ` : ''}
        
        /* UX構築で指定されたレイアウト */
        ${uxStructure?.designSystem?.layout === 'カード型レイアウト' ? `
        .card-layout {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }
        ` : ''}
        
        ${uxStructure?.designSystem?.layout === 'グリッドレイアウト' ? `
        .grid-layout {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        ` : ''}
        
        /* UX構築で指定されたタイポグラフィ */
        .ux-heading {
            font-weight: ${uxStructure?.designSystem?.typography?.heading?.includes('インパクト') ? '700' : '600'};
            line-height: 1.2;
        }
        
        .ux-body {
            line-height: 1.6;
            font-size: 1rem;
        }
        
        .ux-accent {
            color: var(--accent-color);
            font-weight: 600;
        }
    `
  }

  /**
   * UX構築データに基づくナビゲーション生成
   */
  private static generateUXBasedNavigation(uxStructure: any, colors: any, appName: string): string {
    const keyScreens = uxStructure?.keyScreens || []
    
    return `
    <nav class="bg-white shadow-sm border-b" style="border-color: ${colors.border};">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold ux-heading" style="color: ${colors.primary};">
                        ${appName}
                    </h1>
                </div>
                
                <div class="hidden md:block">
                    <div class="flex items-center space-x-4">
                        <button onclick="showPage('dashboard')" class="nav-link hover-smooth px-3 py-2 rounded-md text-sm font-medium">
                            ダッシュボード
                        </button>
                        ${keyScreens.map((screen: any) => `
                        <button onclick="showPage('${screen.name.toLowerCase()}')" class="nav-link hover-smooth px-3 py-2 rounded-md text-sm font-medium">
                            ${screen.name}
                        </button>
                        `).join('')}
                    </div>
                </div>
                
                <button class="md:hidden" onclick="toggleMobileMenu()">
                    <i data-lucide="menu"></i>
                </button>
            </div>
        </div>
        
        <!-- モバイルメニュー -->
        <div id="mobile-menu" class="hidden md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <button onclick="showPage('dashboard')" class="block w-full text-left px-3 py-2 text-base font-medium hover-smooth">
                    ダッシュボード
                </button>
                ${keyScreens.map(screen => `
                <button onclick="showPage('${screen.name.toLowerCase()}')" class="block w-full text-left px-3 py-2 text-base font-medium hover-smooth">
                    ${screen.name}
                </button>
                `).join('')}
            </div>
        </div>
    </nav>
    `
  }

  /**
   * UX構築データに基づくメインコンテンツ生成
   */
  private static generateUXBasedMainContent(insights: any, uxStructure: any, colors: any): string {
    const topPageElements = uxStructure?.siteArchitecture?.topPage?.elements || []
    const mainFeatures = uxStructure?.siteArchitecture?.mainFeatures || []
    const keyScreens = uxStructure?.keyScreens || []
    
    return `
    <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- トップページ（UX構築で指定された要素） -->
        <div id="page-dashboard" class="page-content">
            ${topPageElements.includes('ヒーローセクション') ? `
            <section class="hero-section mb-8 p-8 rounded-lg" style="background: linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20);">
                <div class="text-center">
                    <h2 class="text-4xl font-bold ux-heading mb-4" style="color: ${colors.primary};">
                        ${insights.vision}
                    </h2>
                    <p class="text-xl ux-body mb-6" style="color: ${colors.secondary};">
                        ${insights.value}
                    </p>
                    <button class="cta-button hover-smooth px-8 py-3 rounded-lg font-semibold" style="background: ${colors.primary}; color: white;">
                        今すぐ始める
                    </button>
                </div>
            </section>
            ` : ''}
            
            ${topPageElements.includes('価値提案') ? `
            <section class="value-proposition mb-8">
                <h3 class="text-2xl font-bold ux-heading mb-4" style="color: ${colors.text};">
                    なぜ${insights.appName || 'このアプリ'}が必要なのか
                </h3>
                <div class="grid-layout">
                    <div class="card-layout">
                        <h4 class="text-lg font-semibold ux-accent mb-2">課題解決</h4>
                        <p class="ux-body">${insights.motivation}</p>
                    </div>
                    <div class="card-layout">
                        <h4 class="text-lg font-semibold ux-accent mb-2">ターゲット</h4>
                        <p class="ux-body">${insights.target}</p>
                    </div>
                </div>
            </section>
            ` : ''}
            
            ${topPageElements.includes('機能紹介') || mainFeatures.length > 0 ? `
            <section class="features-section mb-8">
                <h3 class="text-2xl font-bold ux-heading mb-6" style="color: ${colors.text};">
                    主要機能
                </h3>
                <div class="grid-layout">
                    ${mainFeatures.map((feature: any) => `
                    <div class="card-layout hover-smooth">
                        <h4 class="text-lg font-semibold ux-accent mb-2">${feature.name}</h4>
                        <p class="ux-body mb-4">${feature.description}</p>
                        <div class="feature-ui-elements">
                            ${feature.uiElements.map((element: any) => `
                            <span class="inline-block px-2 py-1 text-sm rounded mr-2 mb-1" style="background: ${colors.accent}20; color: ${colors.accent};">
                                ${element}
                            </span>
                            `).join('')}
                        </div>
                        <button class="mt-4 px-4 py-2 rounded hover-smooth" style="background: ${colors.primary}; color: white;">
                            ${feature.name}を使う
                        </button>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}
            
            <!-- 統計ダッシュボード -->
            <section class="stats-dashboard mb-8">
                <h3 class="text-2xl font-bold ux-heading mb-6" style="color: ${colors.text};">
                    統計ダッシュボード
                </h3>
                <div class="grid-layout">
                    <div id="stats-cards" class="contents">
                        <!-- 統計カードがここに表示されます -->
                    </div>
                </div>
            </section>

            <!-- 高度なフィルタリング -->
            <section class="filtering-section mb-6">
                <div class="card-layout">
                    <div class="flex flex-wrap gap-4 items-center">
                        <div class="flex-1 min-w-48">
                            <input 
                                type="text" 
                                id="search-input" 
                                placeholder="検索..." 
                                class="w-full px-3 py-2 border rounded-md text-sm" 
                                style="border-color: ${colors.border};"
                                onkeyup="AppState.handleSearch(this.value)"
                            >
                        </div>
                        <div>
                            <select id="category-filter" class="px-3 py-2 border rounded-md text-sm" style="border-color: ${colors.border};" onchange="AppState.handleCategoryFilter(this.value)">
                                <option value="all">すべてのカテゴリ</option>
                                <option value="income">収入</option>
                                <option value="expense">支出</option>
                                <option value="completed">完了</option>
                                <option value="pending">未完了</option>
                            </select>
                        </div>
                        <div>
                            <select id="sort-filter" class="px-3 py-2 border rounded-md text-sm" style="border-color: ${colors.border};" onchange="AppState.handleSort(this.value)">
                                <option value="date-desc">新しい順</option>
                                <option value="date-asc">古い順</option>
                                <option value="title-asc">タイトル順</option>
                                <option value="amount-desc">金額（高い順）</option>
                            </select>
                        </div>
                        <button onclick="AppState.toggleDeleted()" class="px-3 py-2 text-sm border rounded-md hover:bg-gray-50" style="border-color: ${colors.border};">
                            <span id="deleted-toggle-text">削除済み表示</span>
                        </button>
                    </div>
                </div>
            </section>

            <!-- データ管理セクション -->
            <section class="data-management mb-8">
                <div class="card-layout">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-lg font-semibold">データ一覧</h4>
                        <div class="flex gap-2">
                            <button onclick="AppState.exportData()" class="px-3 py-2 text-sm border rounded hover:bg-gray-50" style="border-color: ${colors.border};">
                                エクスポート
                            </button>
                            <button onclick="openCreateModal()" class="px-4 py-2 rounded hover-smooth" style="background: ${colors.accent}; color: white;">
                                新規作成
                            </button>
                        </div>
                    </div>
                    <div id="data-list" class="space-y-3">
                        <!-- データがここに表示されます -->
                    </div>
                </div>
            </section>
        </div>
        
        <!-- UX構築で定義されたキースクリーン -->
        ${keyScreens.map(screen => `
        <div id="page-${screen.name.toLowerCase()}" class="page-content hidden">
            <div class="card-layout">
                <h2 class="text-2xl font-bold ux-heading mb-4" style="color: ${colors.primary};">
                    ${screen.name}
                </h2>
                <p class="ux-body mb-6">${screen.purpose}</p>
                
                <div class="screen-components grid-layout">
                    ${screen.components.map((component: any) => `
                    <div class="component-card p-4 border rounded hover-smooth" style="border-color: ${colors.border};">
                        <h4 class="font-semibold ux-accent mb-2">${component}</h4>
                        <p class="text-sm ux-body">このコンポーネントは${screen.purpose}をサポートします</p>
                        <button class="mt-2 px-3 py-1 text-sm rounded" style="background: ${colors.primary}20; color: ${colors.primary};">
                            ${screen.userAction}
                        </button>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `).join('')}
    </main>
    `
  }

  /**
   * UX構築データに基づくモーダル生成
   */
  private static generateUXBasedModals(uxStructure: any, colors: any): string {
    const mainFeatures = uxStructure?.siteArchitecture?.mainFeatures || []
    
    return `
    <!-- データ作成モーダル -->
    <div id="create-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold ux-heading">新規データ作成</h3>
                <button onclick="closeCreateModal()" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x"></i>
                </button>
            </div>
            
            <form id="create-form" class="space-y-4">
                ${mainFeatures.length > 0 ? mainFeatures[0].uiElements.map((element: any) => {
                  if (element.includes('フォーム') || element.includes('入力')) {
                    return `
                    <div>
                        <label class="block text-sm font-medium ux-body mb-1">タイトル</label>
                        <input type="text" name="title" required class="w-full px-3 py-2 border rounded-md" style="border-color: ${colors.border};">
                    </div>
                    <div>
                        <label class="block text-sm font-medium ux-body mb-1">詳細</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border rounded-md" style="border-color: ${colors.border};"></textarea>
                    </div>`
                  }
                  return ''
                }).join('') : `
                <div>
                    <label class="block text-sm font-medium ux-body mb-1">タイトル</label>
                    <input type="text" name="title" required class="w-full px-3 py-2 border rounded-md" style="border-color: ${colors.border};">
                </div>
                <div>
                    <label class="block text-sm font-medium ux-body mb-1">詳細</label>
                    <textarea name="description" rows="3" class="w-full px-3 py-2 border rounded-md" style="border-color: ${colors.border};"></textarea>
                </div>
                `}
                
                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" onclick="closeCreateModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                        キャンセル
                    </button>
                    <button type="submit" class="px-4 py-2 rounded text-white hover-smooth" style="background: ${colors.primary};">
                        作成
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- 通知トースト -->
    <div id="toast" class="fixed top-4 right-4 px-4 py-2 rounded-lg text-white hidden"></div>
    `
  }

  /**
   * UX構築データに基づく高度なJavaScript生成
   */
  private static generateUXBasedJavaScript(insights: any, uxStructure: any, colors: any): string {
    const userFlow = uxStructure?.siteArchitecture?.userFlow || []
    const appCategory = this.determineCategory(insights.vision, insights.features)
    
    return `
    // Lucide アイコンの初期化
    lucide.createIcons();
    
    // 高度なアプリケーション状態管理
    const AppState = {
        currentPage: 'dashboard',
        data: JSON.parse(localStorage.getItem('app-data') || '[]'),
        settings: JSON.parse(localStorage.getItem('app-settings') || '{"theme": "light", "currency": "JPY", "notifications": true}'),
        stats: JSON.parse(localStorage.getItem('app-stats') || '{}'),
        filters: {
            search: '',
            dateRange: { start: null, end: null },
            category: 'all',
            sortBy: 'date',
            sortOrder: 'desc'
        },
        
        // UX構築で定義されたユーザーフロー
        userFlow: ${JSON.stringify(userFlow)},
        currentFlowStep: 0,
        
        // 高度な保存機能
        save() {
            localStorage.setItem('app-data', JSON.stringify(this.data));
            localStorage.setItem('app-settings', JSON.stringify(this.settings));
            localStorage.setItem('app-stats', JSON.stringify(this.stats));
            this.updateStats();
        },
        
        // インテリジェントなデータ追加
        addData(item) {
            item.id = Date.now().toString();
            item.createdAt = new Date().toISOString();
            item.updatedAt = item.createdAt;
            
            // カテゴリ別特定処理
            if ('${appCategory}' === 'finance' && item.amount) {
                item.amount = parseFloat(item.amount);
                if (item.type && !item.category) {
                    item.category = item.type === 'income' ? '収入' : '支出';
                }
            }
            
            this.data.push(item);
            this.save();
            this.renderDataList();
            this.renderStats();
            this.showToast('データを作成しました', 'success');
            
            // 自動分析とサジェスト
            this.analyzeAndSuggest(item);
        },
        
        // 高度な削除機能（ソフトデリート対応）
        deleteData(id) {
            const item = this.data.find(d => d.id === id);
            if (item) {
                item.deletedAt = new Date().toISOString();
                item.deleted = true;
            }
            this.save();
            this.renderDataList();
            this.renderStats();
            this.showToast('データを削除しました', 'info');
        },
        
        // データ復元機能
        restoreData(id) {
            const item = this.data.find(d => d.id === id);
            if (item) {
                delete item.deletedAt;
                delete item.deleted;
                this.save();
                this.renderDataList();
                this.showToast('データを復元しました', 'success');
            }
        },
        
        // 高度な編集機能
        updateData(id, updates) {
            const item = this.data.find(d => d.id === id);
            if (item) {
                Object.assign(item, updates);
                item.updatedAt = new Date().toISOString();
                this.save();
                this.renderDataList();
                this.renderStats();
                this.showToast('データを更新しました', 'success');
            }
        },
        
        // 高度なフィルタリングとレンダリング
        renderDataList() {
            const container = document.getElementById('data-list');
            if (!container) return;
            
            let filteredData = this.getFilteredData();
            
            if (filteredData.length === 0) {
                container.innerHTML = \`
                    <div class="text-center py-8">
                        <div class="text-gray-400 mb-4">
                            <i data-lucide="database" class="w-12 h-12 mx-auto mb-2"></i>
                        </div>
                        <p class="text-gray-500">データがありません</p>
                        <button onclick="openCreateModal()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            最初のデータを作成
                        </button>
                    </div>
                \`;
                lucide.createIcons();
                return;
            }
            
            container.innerHTML = filteredData.map(item => \`
                <div class="bg-white border rounded-lg p-4 hover-smooth \${item.deleted ? 'opacity-50' : ''}" data-item-id="\${item.id}">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h5 class="font-semibold text-gray-900">\${item.title}</h5>
                                \${item.type === 'income' ? 
                                    '<span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">収入</span>' : 
                                    item.type === 'expense' ? '<span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">支出</span>' : ''
                                }
                                \${item.amount ? 
                                    \`<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">\${new Intl.NumberFormat('ja-JP', {style: 'currency', currency: 'JPY'}).format(item.amount)}</span>\` : 
                                    ''
                                }
                            </div>
                            
                            <p class="text-sm text-gray-600 mb-2">\${item.description || '詳細なし'}</p>
                            \${item.category ? \`<p class="text-xs text-gray-500">カテゴリ: \${item.category}</p>\` : ''}
                            
                            <div class="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                <span class="flex items-center gap-1">
                                    <i data-lucide="calendar" class="w-3 h-3"></i>
                                    \${new Date(item.createdAt).toLocaleDateString('ja-JP')}
                                </span>
                                \${item.updatedAt && item.updatedAt !== item.createdAt ? \`
                                <span class="flex items-center gap-1">
                                    <i data-lucide="edit-3" class="w-3 h-3"></i>
                                    更新: \${new Date(item.updatedAt).toLocaleDateString('ja-JP')}
                                </span>
                                \` : ''}
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-2 ml-4">
                            \${!item.deleted ? \`
                                <button onclick="openEditModal('\${item.id}')" class="p-1 text-blue-500 hover:text-blue-700" title="編集">
                                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                                </button>
                                <button onclick="AppState.deleteData('\${item.id}')" class="p-1 text-red-500 hover:text-red-700" title="削除">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            \` : \`
                                <button onclick="AppState.restoreData('\${item.id}')" class="p-1 text-green-500 hover:text-green-700" title="復元">
                                    <i data-lucide="undo" class="w-4 h-4"></i>
                                </button>
                            \`}
                        </div>
                    </div>
                </div>
            \`).join('');
            
            // アイコンを再初期化
            lucide.createIcons();
        },
        
        // 高度なフィルタリング機能
        getFilteredData() {
            let filtered = [...this.data];
            
            // 検索フィルタ
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase();
                filtered = filtered.filter(item => 
                    item.title?.toLowerCase().includes(search) ||
                    item.description?.toLowerCase().includes(search)
                );
            }
            
            // カテゴリフィルタ
            if (this.filters.category !== 'all') {
                filtered = filtered.filter(item => item.category === this.filters.category);
            }
            
            // 日付範囲フィルタ
            if (this.filters.dateRange.start && this.filters.dateRange.end) {
                const start = new Date(this.filters.dateRange.start);
                const end = new Date(this.filters.dateRange.end);
                filtered = filtered.filter(item => {
                    const itemDate = new Date(item.createdAt);
                    return itemDate >= start && itemDate <= end;
                });
            }
            
            // 削除されたアイテムのフィルタリング
            if (!this.showDeleted) {
                filtered = filtered.filter(item => !item.deleted);
            }
            
            // ソート
            filtered.sort((a, b) => {
                let aVal, bVal;
                
                switch(this.filters.sortBy) {
                    case 'title':
                        aVal = a.title || '';
                        bVal = b.title || '';
                        break;
                    case 'amount':
                        aVal = parseFloat(a.amount || 0);
                        bVal = parseFloat(b.amount || 0);
                        break;
                    default: // date
                        aVal = new Date(a.createdAt);
                        bVal = new Date(b.createdAt);
                }
                
                if (this.filters.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            
            return filtered;
        },
        
        // フィルター機能
        handleSearch(query) {
            this.filters.search = query;
            this.renderDataList();
        },
        
        handleCategoryFilter(category) {
            this.filters.category = category;
            this.renderDataList();
        },
        
        handleSort(sortOption) {
            const [sortBy, sortOrder] = sortOption.split('-');
            this.filters.sortBy = sortBy;
            this.filters.sortOrder = sortOrder;
            this.renderDataList();
        },
        
        toggleDeleted() {
            this.showDeleted = !this.showDeleted;
            document.getElementById('deleted-toggle-text').textContent = 
                this.showDeleted ? '削除済み非表示' : '削除済み表示';
            this.renderDataList();
        },
        
        // データエクスポート
        exportData() {
            const data = this.getFilteredData();
            const csv = this.convertToCSV(data);
            this.downloadCSV(csv, 'app-data.csv');
            this.showToast('データをエクスポートしました', 'success');
        },
        
        convertToCSV(data) {
            if (data.length === 0) return '';
            
            const headers = Object.keys(data[0]).filter(key => !key.startsWith('_'));
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => 
                        JSON.stringify(row[header] || '')
                    ).join(',')
                )
            ].join('\\n');
            
            return csvContent;
        },
        
        downloadCSV(csvContent, filename) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        
        // 統計機能
        renderStats() {
            const container = document.getElementById('stats-cards');
            if (!container) return;
            
            const stats = this.calculateStats();
            
            container.innerHTML = Object.entries(stats).map(([key, value]) => \`
                <div class="card-layout">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">\${key}</p>
                            <p class="text-2xl font-bold text-gray-900">\${value}</p>
                        </div>
                        <div class="text-blue-500">
                            <i data-lucide="\${this.getStatIcon(key)}" class="w-8 h-8"></i>
                        </div>
                    </div>
                </div>
            \`).join('');
            
            lucide.createIcons();
        },
        
        calculateStats() {
            const active = this.data.filter(item => !item.deleted);
            const stats = {
                '総データ数': active.length,
                '今月の作成': active.filter(item => {
                    const created = new Date(item.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length
            };
            
            // カテゴリ別統計
            if (active.some(item => item.amount)) {
                const totalAmount = active.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                stats['合計金額'] = new Intl.NumberFormat('ja-JP', {style: 'currency', currency: 'JPY'}).format(totalAmount);
            }
            
            return stats;
        },
        
        getStatIcon(statName) {
            const iconMap = {
                '総データ数': 'database',
                '今月の作成': 'calendar',
                '合計金額': 'yen-sign'
            };
            return iconMap[statName] || 'bar-chart';
        },
        
        updateStats() {
            this.renderStats();
        },
        
        showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = \`fixed top-4 right-4 px-4 py-2 rounded-lg text-white \${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }\`;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    };
    
    // ページナビゲーション
    function showPage(pageId) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            AppState.currentPage = pageId;
        }
        
        // モバイルメニューを閉じる
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    // モバイルメニュー
    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }
    
    // モーダル管理
    function openCreateModal() {
        document.getElementById('create-modal').classList.remove('hidden');
    }
    
    function closeCreateModal() {
        document.getElementById('create-modal').classList.add('hidden');
        document.getElementById('create-form').reset();
    }
    
    function openEditModal(id) {
        const item = AppState.data.find(d => d.id === id);
        if (item) {
            // 編集モーダルを開く（簡易実装）
            const title = prompt('タイトルを編集:', item.title);
            const description = prompt('詳細を編集:', item.description || '');
            
            if (title !== null) {
                AppState.updateData(id, { title, description });
            }
        }
    }
    
    // フォーム送信
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('create-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    amount: formData.get('amount'),
                    type: formData.get('type'),
                    category: formData.get('category')
                };
                
                AppState.addData(data);
                closeCreateModal();
            });
        }
        
        // 初期化
        AppState.renderDataList();
        AppState.renderStats();
        lucide.createIcons();
        
        // UX構築で定義されたユーザーフローの案内
        if (AppState.userFlow.length > 0) {
            console.log('🎯 ユーザーフロー:', AppState.userFlow);
        }
    });
    `
  }

  /**
   * カラーシステム構築
   */
  private static buildColorSystem(uiStyle: any): any {
    return {
      primary: uiStyle.colors?.primary || uiStyle.primaryColor || '#3B82F6',
      secondary: uiStyle.colors?.secondary || uiStyle.secondaryColor || '#6B7280',
      accent: uiStyle.colors?.accent || uiStyle.accentColor || '#10B981',
      background: uiStyle.colors?.background || '#FFFFFF',
      text: uiStyle.colors?.text || '#1F2937',
      border: uiStyle.colors?.border || '#E5E7EB'
    }
  }

  /**
   * アプリ名抽出
   */
  private static extractAppName(vision: string): string {
    const patterns = [
      /(.+?)管理/,
      /(.+?)アプリ/,
      /(.+?)システム/,
      /(.+?)ツール/
    ]
    
    for (const pattern of patterns) {
      const match = vision.match(pattern)
      if (match) return match[1].trim()
    }
    
    return 'MyApp'
  }


  /**
   * カテゴリ判定
   */
  private static determineCategory(vision: string, features: string[]): string {
    const allText = (vision + ' ' + features.join(' ')).toLowerCase()
    
    if (allText.includes('収入') || allText.includes('給与') || allText.includes('お金') || allText.includes('支出') || allText.includes('家計')) return 'finance'
    if (allText.includes('タスク') || allText.includes('todo') || allText.includes('管理') || allText.includes('プロジェクト')) return 'productivity'
    if (allText.includes('学習') || allText.includes('勉強') || allText.includes('教育') || allText.includes('スコア')) return 'education'
    if (allText.includes('健康') || allText.includes('運動') || allText.includes('フィットネス')) return 'health'
    
    return 'general'
  }

  /**
   * フォールバックアプリ生成
   */
  public static generateFallbackApp(insights: any, uiStyle: any): string {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${insights.appName || 'MyApp'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto p-8">
        <h1 class="text-3xl font-bold mb-4">${insights.vision}</h1>
        <p class="text-lg mb-6">${insights.value}</p>
        <div class="bg-white rounded-lg p-6 shadow">
            <h2 class="text-xl font-semibold mb-4">主要機能</h2>
            <ul class="space-y-2">
                ${insights.features?.map(feature => `<li class="flex items-center"><span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>${feature}</li>`).join('') || ''}
            </ul>
        </div>
    </div>
</body>
</html>`
  }
}

// ストリーミング生成関数
function createEnhancedProgressStream(
  insights: any, 
  uiStyle: any, 
  uxDesign: any, 
  selectedTopPageDesign: any,
  uxStructure?: any
): ReadableStream {
  return new ReadableStream({
    start(controller) {
      const steps = [
        { progress: 5, message: 'UX構築データを分析中...' },
        { progress: 15, message: 'サイトアーキテクチャを解析中...' },
        { progress: 25, message: 'デザインシステムを構築中...' },
        { progress: 35, message: 'キースクリーンを設計中...' },
        { progress: 45, message: 'ユーザーフローを実装中...' },
        { progress: 55, message: 'UIコンポーネントを生成中...' },
        { progress: 65, message: 'インタラクションを設定中...' },
        { progress: 75, message: 'レスポンシブ対応を実装中...' },
        { progress: 85, message: 'データ管理機能を統合中...' },
        { progress: 95, message: '最終調整とテスト中...' }
      ]
      
      let currentStep = 0
      
      const interval = setInterval(async () => {
        if (currentStep < steps.length) {
          const step = steps[currentStep]
          
          const progressData = JSON.stringify({
            progress: step.progress,
            message: step.message,
            stage: currentStep + 1,
            totalStages: steps.length
          })
          
          controller.enqueue(`data: ${progressData}\n\n`)
          currentStep++
        } else {
          clearInterval(interval)
          
          try {
            // UX構築データを活用したコード生成
            const generatedCode = await UXStructureCodeGenerator.generateFromUXStructure(
              insights, 
              uiStyle, 
              uxStructure
            )
            
            const finalData = JSON.stringify({
              progress: 100,
              message: '生成完了！',
              code: generatedCode,
              generationType: 'ux-enhanced',
              features: [
                'UX構築データ完全反映',
                'キースクリーン実装',
                'ユーザーフロー対応',
                'デザインシステム統合',
                'インタラクション実装'
              ]
            })
            
            controller.enqueue(`data: ${finalData}\n\n`)
            controller.close()
            
          } catch (error) {
            console.error('Code generation error:', error)
            
            const errorData = JSON.stringify({
              progress: 100,
              message: 'エラーが発生しました',
              error: (error as any)?.message || 'Unknown error',
              code: ''
            })
            
            controller.enqueue(`data: ${errorData}\n\n`)
            controller.close()
          }
        }
      }, 2000) // 各ステップに2秒
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ModernAppRequest

    if (!body.insights || !body.uiStyle) {
      return NextResponse.json(
        { error: 'Insights and UI style are required' },
        { status: 400 }
      )
    }

    console.log('🎯 [generate-modern-app] UX構築データ受信:', body.uxStructure ? '有り' : '無し')

    const stream = createEnhancedProgressStream(
      body.insights, 
      body.uiStyle, 
      body.uxDesign, 
      body.selectedTopPageDesign,
      body.uxStructure  // UX構築データを渡す
    )

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('[generate-modern-app] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'モダンアプリ生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    description: 'UX Structure Enhanced Modern Web App Generator API',
    timestamp: new Date().toISOString()
  })
}