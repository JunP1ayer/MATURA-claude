/**
 * API Route: Generation Status
 * モック API - 生成ステータスの取得・更新
 */

import { NextRequest, NextResponse } from 'next/server'

// モックデータ保存用（実際の実装ではRedisやデータベースを使用）
let mockGenerationState = {
  id: `gen_${  Date.now()}`,
  status: 'idle', // idle, generating, completed, error
  progress: 0,
  startedAt: null as string | null,
  completedAt: null as string | null,
  currentPhase: null as string | null,
  totalPhases: 5,
  generatedFiles: [] as string[],
  errors: [] as string[],
  warnings: [] as string[],
  estimatedTimeRemaining: null as number | null
}

export async function GET() {
  try {
    console.log('📡 [API] GET /api/generation/status called')
    
    // リアルタイムデータのシミュレーション
    const response = {
      success: true,
      data: {
        ...mockGenerationState,
        timestamp: new Date().toISOString(),
        serverTime: Date.now()
      }
    }

    console.log('✅ [API] Generation status retrieved:', response.data.status)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('💥 [API] Error getting generation status:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get generation status',
        data: null
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 [API] POST /api/generation/status called with:', body)

    const { action, data } = body

    switch (action) {
      case 'start':
        mockGenerationState = {
          ...mockGenerationState,
          status: 'generating',
          progress: 0,
          startedAt: new Date().toISOString(),
          currentPhase: 'Foundation Setup',
          errors: [],
          warnings: [],
          estimatedTimeRemaining: 1800000 // 30分
        }
        console.log('🚀 [API] Generation started')
        break

      case 'update_progress':
        if (data?.progress !== undefined) {
          mockGenerationState.progress = Math.min(100, Math.max(0, data.progress))
          
          // フェーズの自動更新
          if (mockGenerationState.progress >= 20 && mockGenerationState.currentPhase === 'Foundation Setup') {
            mockGenerationState.currentPhase = 'UI Component Architecture'
          } else if (mockGenerationState.progress >= 40 && mockGenerationState.currentPhase === 'UI Component Architecture') {
            mockGenerationState.currentPhase = 'State Management System'
          } else if (mockGenerationState.progress >= 60 && mockGenerationState.currentPhase === 'State Management System') {
            mockGenerationState.currentPhase = 'Core Application Logic'
          } else if (mockGenerationState.progress >= 80 && mockGenerationState.currentPhase === 'Core Application Logic') {
            mockGenerationState.currentPhase = 'Quality Assurance'
          }
          
          console.log(`📊 [API] Progress updated: ${mockGenerationState.progress}%`)
        }
        break

      case 'complete':
        mockGenerationState = {
          ...mockGenerationState,
          status: 'completed',
          progress: 100,
          completedAt: new Date().toISOString(),
          currentPhase: 'Completed',
          generatedFiles: [
            'app/layout.tsx',
            'app/page.tsx',
            'app/ui-pattern-a/page.tsx',
            'app/ui-pattern-b/page.tsx',
            'lib/store.ts',
            'components/ui/button.tsx',
            'components/ui/card.tsx',
            'components/ui/badge.tsx',
            'tailwind.config.ts',
            'package.json'
          ],
          estimatedTimeRemaining: 0
        }
        console.log('✅ [API] Generation completed')
        break

      case 'error':
        mockGenerationState = {
          ...mockGenerationState,
          status: 'error',
          errors: [...mockGenerationState.errors, data?.error || 'Unknown error occurred']
        }
        console.log('❌ [API] Generation error:', data?.error)
        break

      case 'reset':
        mockGenerationState = {
          id: `gen_${  Date.now()}`,
          status: 'idle',
          progress: 0,
          startedAt: null,
          completedAt: null,
          currentPhase: null,
          totalPhases: 5,
          generatedFiles: [],
          errors: [],
          warnings: [],
          estimatedTimeRemaining: null
        }
        console.log('🔄 [API] Generation reset')
        break

      default:
        console.warn('⚠️ [API] Unknown action:', action)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unknown action',
            data: null
          },
          { status: 400 }
        )
    }

    const response = {
      success: true,
      data: {
        ...mockGenerationState,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('💥 [API] Error updating generation status:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update generation status',
        data: null
      },
      { status: 500 }
    )
  }
}