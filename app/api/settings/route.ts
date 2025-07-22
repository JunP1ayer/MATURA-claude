/**
 * API Route: Settings Management
 * モック API - アプリケーション設定の取得・更新
 */

import { NextRequest, NextResponse } from 'next/server'

// モック設定データ
let mockSettings = {
  user: {
    id: `user_${  Date.now()}`,
    name: 'Demo User',
    email: 'demo@matura.ai',
    avatar: null,
    preferences: {
      theme: 'auto', // auto, light, dark
      language: 'ja',
      timezone: 'Asia/Tokyo',
      notifications: {
        email: true,
        browser: true,
        generation: true,
        errors: true
      }
    }
  },

  generation: {
    defaultPattern: 'pattern-a', // pattern-a, pattern-b
    geminiApi: {
      enabled: false,
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 4096
    },
    quality: {
      enableLinting: true,
      enableTypeCheck: true,
      enableTesting: true,
      strictMode: true
    },
    deployment: {
      platform: 'vercel',
      autoDeployment: false,
      environmentVariables: {},
      customDomain: null
    },
    features: {
      shadcnUi: true,
      tailwindCss: true,
      zustandStore: true,
      darkMode: true,
      responsive: true,
      accessibility: true
    }
  },

  project: {
    defaultName: 'MATURA Generated App',
    outputDirectory: './generated',
    backupEnabled: true,
    maxBackups: 5,
    fileNaming: {
      convention: 'kebab-case', // kebab-case, camelCase, PascalCase
      includeTimestamp: false
    }
  },

  advanced: {
    experimentalFeatures: {
      serverComponents: true,
      appRouter: true,
      turbopack: false,
      edgeRuntime: false
    },
    performance: {
      caching: true,
      compression: true,
      imageOptimization: true,
      codesplitting: true
    },
    security: {
      csrfProtection: true,
      xssProtection: true,
      rateLimiting: true,
      apiKeyRequired: false
    }
  },

  metadata: {
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    configId: `config_${  Date.now()}`
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const keys = searchParams.get('keys')?.split(',')

    console.log('📡 [API] GET /api/settings called with category:', category)

    let responseData = { ...mockSettings }

    // カテゴリフィルタリング
    if (category) {
      switch (category) {
        case 'user':
          responseData = { ...mockSettings, user: mockSettings.user, metadata: mockSettings.metadata }
          break
        case 'generation':
          responseData = { ...mockSettings, generation: mockSettings.generation, metadata: mockSettings.metadata }
          break
        case 'project':
          responseData = { ...mockSettings, project: mockSettings.project, metadata: mockSettings.metadata }
          break
        case 'advanced':
          responseData = { ...mockSettings, advanced: mockSettings.advanced, metadata: mockSettings.metadata }
          break
        default:
          console.warn('⚠️ [API] Unknown category:', category)
      }
    }

    // キー指定フィルタリング
    if (keys && keys.length > 0) {
      const filteredData: any = { metadata: mockSettings.metadata }
      keys.forEach(key => {
        if (mockSettings[key as keyof typeof mockSettings]) {
          filteredData[key] = mockSettings[key as keyof typeof mockSettings]
        }
      })
      responseData = filteredData
    }

    console.log('✅ [API] Settings retrieved successfully')

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('💥 [API] Error getting settings:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get settings',
        data: null
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 [API] PUT /api/settings called with updates:', Object.keys(body))

    const { category, settings } = body

    if (!settings) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Settings data is required',
          data: null
        },
        { status: 400 }
      )
    }

    // カテゴリ別更新
    if (category) {
      if (mockSettings[category as keyof typeof mockSettings]) {
        mockSettings[category as keyof typeof mockSettings] = {
          ...mockSettings[category as keyof typeof mockSettings],
          ...settings
        }
        console.log(`✅ [API] Category '${category}' settings updated`)
      } else {
        console.warn('⚠️ [API] Unknown category:', category)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unknown settings category',
            data: null
          },
          { status: 400 }
        )
      }
    } else {
      // 全体更新
      mockSettings = {
        ...mockSettings,
        ...settings
      }
      console.log('✅ [API] All settings updated')
    }

    // メタデータ更新
    mockSettings.metadata = {
      ...mockSettings.metadata,
      lastUpdated: new Date().toISOString()
    }

    // 設定検証のシミュレーション
    const validationResults = {
      valid: true,
      warnings: [] as string[],
      errors: [] as string[]
    }

    // Gemini API設定の検証
    if (mockSettings.generation.geminiApi.enabled && !process.env.GEMINI_API_KEY) {
      validationResults.warnings.push('Gemini API key not found in environment variables')
    }

    // デプロイ設定の検証
    if (mockSettings.generation.deployment.autoDeployment && mockSettings.generation.deployment.platform === 'vercel') {
      validationResults.warnings.push('Auto-deployment requires Vercel CLI configuration')
    }

    const response = {
      success: true,
      data: {
        settings: mockSettings,
        validation: validationResults,
        updated: {
          timestamp: new Date().toISOString(),
          category: category || 'all',
          fieldsUpdated: Object.keys(settings)
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 [API] Error updating settings:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings',
        data: null
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    console.log('📡 [API] POST /api/settings called with action:', action)

    switch (action) {
      case 'reset':
        const category = data?.category
        
        if (category && mockSettings[category as keyof typeof mockSettings]) {
          // カテゴリ別リセット（デフォルト値に戻す）
          const defaultSettings = {
            user: {
              preferences: {
                theme: 'auto',
                language: 'ja',
                timezone: 'Asia/Tokyo',
                notifications: {
                  email: true,
                  browser: true,
                  generation: true,
                  errors: true
                }
              }
            },
            generation: {
              defaultPattern: 'pattern-a',
              geminiApi: {
                enabled: false,
                model: 'gemini-pro',
                temperature: 0.7,
                maxTokens: 4096
              }
            }
          }
          
          // Reset category settings (simplified)
          console.log('Settings reset for category:', category)
          
          console.log(`🔄 [API] Settings category '${category}' reset to defaults`)
        } else {
          console.log('🔄 [API] All settings reset to defaults')
          // 全設定リセット（簡略化）
          mockSettings.generation.defaultPattern = 'pattern-a'
          mockSettings.generation.geminiApi.enabled = false
          mockSettings.user.preferences.theme = 'auto'
        }

        mockSettings.metadata.lastUpdated = new Date().toISOString()
        break

      case 'backup':
        const backupId = `backup_${  Date.now()}`
        console.log(`💾 [API] Creating settings backup: ${backupId}`)
        
        // バックアップのシミュレーション
        const backupResult = {
          backupId,
          timestamp: new Date().toISOString(),
          size: '2.4KB',
          settings: { ...mockSettings }
        }

        return NextResponse.json({
          success: true,
          data: backupResult
        })

      case 'restore':
        const restoreBackupId = data?.backupId
        console.log(`🔄 [API] Restoring settings from backup: ${restoreBackupId}`)
        
        // 復元のシミュレーション（実際にはバックアップデータを読み込む）
        const restoreResult = {
          backupId: restoreBackupId,
          restoredAt: new Date().toISOString(),
          fieldsRestored: Object.keys(mockSettings)
        }

        return NextResponse.json({
          success: true,
          data: restoreResult
        })

      case 'validate':
        console.log('🔍 [API] Validating current settings')
        
        // 設定検証のシミュレーション
        const validationResult = {
          valid: true,
          warnings: [
            'Gemini API key not configured',
            'Auto-deployment not set up'
          ],
          errors: [],
          recommendations: [
            'Configure API key for enhanced generation',
            'Set up Vercel CLI for auto-deployment'
          ]
        }

        return NextResponse.json({
          success: true,
          data: validationResult
        })

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

    return NextResponse.json({
      success: true,
      data: {
        settings: mockSettings,
        action,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('💥 [API] Error processing settings action:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process settings action',
        data: null
      },
      { status: 500 }
    )
  }
}