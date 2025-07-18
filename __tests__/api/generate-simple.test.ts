import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/generate-simple/route'

// Mock the OpenAI client
jest.mock('@/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}))

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: 'test-id' },
            error: null,
          })),
        })),
      })),
    })),
  },
}))

describe('/api/generate-simple', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle valid request', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        idea: 'タスク管理アプリを作りたい',
      },
    })

    // Mock successful OpenAI response
    const mockOpenAI = require('@/lib/openai').openai
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            name: 'Task Manager',
            description: 'Simple task management app',
            features: ['Create tasks', 'Mark as complete'],
            schema: {
              tables: [{
                name: 'tasks',
                columns: [
                  { name: 'id', type: 'uuid', primaryKey: true },
                  { name: 'title', type: 'text' },
                  { name: 'completed', type: 'boolean' },
                ],
              }],
            },
          }),
        },
      }],
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.app).toBeDefined()
  })

  it('should handle missing idea', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {},
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('アイデアが入力されていません')
  })

  it('should handle empty idea', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        idea: '',
      },
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('アイデアが入力されていません')
  })

  it('should handle OpenAI API error', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        idea: 'タスク管理アプリを作りたい',
      },
    })

    // Mock OpenAI error
    const mockOpenAI = require('@/lib/openai').openai
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API Error'))

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toContain('アプリの生成に失敗しました')
  })

  it('should handle invalid JSON response from OpenAI', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        idea: 'タスク管理アプリを作りたい',
      },
    })

    // Mock invalid JSON response
    const mockOpenAI = require('@/lib/openai').openai
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: 'Invalid JSON response',
        },
      }],
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toContain('アプリの生成に失敗しました')
  })

  it('should handle database error', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        idea: 'タスク管理アプリを作りたい',
      },
    })

    // Mock successful OpenAI response
    const mockOpenAI = require('@/lib/openai').openai
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            name: 'Task Manager',
            description: 'Simple task management app',
            features: ['Create tasks', 'Mark as complete'],
            schema: {
              tables: [{
                name: 'tasks',
                columns: [
                  { name: 'id', type: 'uuid', primaryKey: true },
                  { name: 'title', type: 'text' },
                  { name: 'completed', type: 'boolean' },
                ],
              }],
            },
          }),
        },
      }],
    })

    // Mock database error
    const mockSupabase = require('@/lib/supabase').supabase
    mockSupabase.from.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' },
          })),
        })),
      })),
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toContain('データベースエラー')
  })
})