import { createClient } from '@supabase/supabase-js'

// Demo Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project-placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schemas for different app types
export interface BaseItem {
  id: string
  created_at: string
  updated_at: string
  app_id: string
}

export interface HotelBooking extends BaseItem {
  hotel_name: string
  guest_name: string
  check_in: string
  check_out: string
  room_type: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface TaskItem extends BaseItem {
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
}

export interface RecipeItem extends BaseItem {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  category: string
  image_url?: string
}

export interface InventoryItem extends BaseItem {
  name: string
  description?: string
  quantity: number
  unit: string
  category: string
  location?: string
  min_stock: number
  cost_per_unit?: number
}

export interface BlogPost extends BaseItem {
  title: string
  content: string
  excerpt?: string
  published: boolean
  author: string
  tags: string[]
  featured_image?: string
  slug: string
}

// CRUD operations for different app types
export const hotelBookingService = {
  async getAll(appId: string): Promise<HotelBooking[]> {
    // Mock data for demo purposes since we don't have actual Supabase connection
    return [
      {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_id: appId,
        hotel_name: 'グランドホテル東京',
        guest_name: '田中太郎',
        check_in: '2024-01-15',
        check_out: '2024-01-17',
        room_type: 'デラックスツイン',
        guests: 2,
        total_price: 45000,
        status: 'confirmed'
      },
      {
        id: '2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_id: appId,
        hotel_name: 'シティホテル大阪',
        guest_name: '佐藤花子',
        check_in: '2024-01-20',
        check_out: '2024-01-22',
        room_type: 'スタンダードシングル',
        guests: 1,
        total_price: 18000,
        status: 'pending'
      }
    ]
  },

  async create(data: Omit<HotelBooking, 'id' | 'created_at' | 'updated_at'>): Promise<HotelBooking> {
    const newBooking: HotelBooking = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newBooking
  },

  async update(id: string, data: Partial<HotelBooking>): Promise<HotelBooking> {
    return {
      ...data,
      id,
      updated_at: new Date().toISOString()
    } as HotelBooking
  },

  async delete(id: string): Promise<void> {
    // Mock delete operation
    console.log(`Deleted booking ${id}`)
  }
}

export const taskService = {
  async getAll(appId: string): Promise<TaskItem[]> {
    return [
      {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_id: appId,
        title: 'プロジェクト企画書作成',
        description: '新サービスのプロジェクト企画書を作成する',
        completed: false,
        priority: 'high',
        due_date: '2024-01-20'
      },
      {
        id: '2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_id: appId,
        title: '会議資料準備',
        description: '明日の役員会議の資料を準備する',
        completed: true,
        priority: 'medium'
      }
    ]
  },

  async create(data: Omit<TaskItem, 'id' | 'created_at' | 'updated_at'>): Promise<TaskItem> {
    const newTask: TaskItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newTask
  },

  async update(id: string, data: Partial<TaskItem>): Promise<TaskItem> {
    return {
      ...data,
      id,
      updated_at: new Date().toISOString()
    } as TaskItem
  },

  async delete(id: string): Promise<void> {
    console.log(`Deleted task ${id}`)
  }
}

export const recipeService = {
  async getAll(appId: string): Promise<RecipeItem[]> {
    return [
      {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_id: appId,
        title: 'チキンカレー',
        description: 'スパイシーで本格的なチキンカレーレシピ',
        ingredients: ['鶏肉 500g', '玉ねぎ 2個', 'トマト 2個', 'カレー粉 大さじ3', 'ココナッツミルク 400ml'],
        instructions: ['玉ねぎを炒める', '鶏肉を加えて炒める', 'トマトとスパイスを加える', 'ココナッツミルクで煮込む'],
        prep_time: 20,
        cook_time: 40,
        servings: 4,
        category: 'メインディッシュ'
      }
    ]
  },

  async create(data: Omit<RecipeItem, 'id' | 'created_at' | 'updated_at'>): Promise<RecipeItem> {
    const newRecipe: RecipeItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newRecipe
  },

  async update(id: string, data: Partial<RecipeItem>): Promise<RecipeItem> {
    return {
      ...data,
      id,
      updated_at: new Date().toISOString()
    } as RecipeItem
  },

  async delete(id: string): Promise<void> {
    console.log(`Deleted recipe ${id}`)
  }
}

// Generic service factory
export function createCRUDService<T extends BaseItem>(mockData: T[] = []) {
  return {
    async getAll(appId: string): Promise<T[]> {
      return mockData.filter(item => item.app_id === appId)
    },

    async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
      const newItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as T
      mockData.push(newItem)
      return newItem
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      const index = mockData.findIndex(item => item.id === id)
      if (index !== -1) {
        mockData[index] = { ...mockData[index], ...data, updated_at: new Date().toISOString() }
        return mockData[index]
      }
      throw new Error('Item not found')
    },

    async delete(id: string): Promise<void> {
      const index = mockData.findIndex(item => item.id === id)
      if (index !== -1) {
        mockData.splice(index, 1)
      }
    }
  }
}