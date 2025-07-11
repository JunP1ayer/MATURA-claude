import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // データベースの代わりにメモリ内に保存（実際の実装では適切なデータベースを使用）
    const mockDatabase = {
      expenses: [],
      recipes: [],
      tasks: [],
      workouts: [],
      notes: [],
      products: []
    }
    
    // リクエストのタイプを判定してモックデータを生成
    const { type, ...formData } = data
    
    let response
    
    switch (type) {
      case 'expense':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          category: formData.category || 'その他',
          amount: parseFloat(formData.amount) || 0
        }
        break
        
      case 'recipe':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          cookingTime: formData.cookingTime || '30分',
          difficulty: formData.difficulty || '普通'
        }
        break
        
      case 'task':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          completed: false,
          priority: formData.priority || 'medium'
        }
        break
        
      case 'workout':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          duration: formData.duration || '30分',
          calories: formData.calories || 200
        }
        break
        
      case 'note':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          tags: formData.tags || []
        }
        break
        
      case 'product':
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          price: parseFloat(formData.price) || 0,
          inStock: formData.inStock !== false
        }
        break
        
      default:
        response = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          message: 'データが正常に保存されました'
        }
    }
    
    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: response,
      message: `${type || 'データ'}が正常に保存されました`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Mock API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'データの保存に失敗しました',
        message: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    // モックデータの生成
    const mockData = {
      expense: [
        { id: 1, title: '食費', amount: 3000, category: '食費', date: '2024-01-15' },
        { id: 2, title: '交通費', amount: 1500, category: '交通', date: '2024-01-14' }
      ],
      recipe: [
        { id: 1, title: 'カレーライス', ingredients: ['じゃがいも', '人参', '玉ねぎ'], cookingTime: '45分' },
        { id: 2, title: 'オムライス', ingredients: ['卵', 'ご飯', 'ケチャップ'], cookingTime: '20分' }
      ],
      task: [
        { id: 1, title: '会議準備', completed: false, priority: 'high', dueDate: '2024-01-20' },
        { id: 2, title: 'レポート作成', completed: true, priority: 'medium', dueDate: '2024-01-18' }
      ],
      workout: [
        { id: 1, title: 'ランニング', duration: '30分', calories: 300, date: '2024-01-15' },
        { id: 2, title: '筋トレ', duration: '45分', calories: 200, date: '2024-01-14' }
      ]
    }
    
    const data = type ? mockData[type as keyof typeof mockData] || [] : mockData
    
    return NextResponse.json({
      success: true,
      data,
      type: type || 'all',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Mock API GET Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'データの取得に失敗しました' 
      },
      { status: 500 }
    )
  }
}