import OpenAI from 'openai'
import { z } from 'zod'

// OpenAI設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 自己拡張リクエストのスキーマ
const SelfExpansionRequestSchema = z.object({
  appId: z.string(),
  userRequest: z.string(),
  currentCode: z.string(),
  appType: z.string(),
  existingFeatures: z.array(z.string()),
})

type SelfExpansionRequest = z.infer<typeof SelfExpansionRequestSchema>

// 拡張可能性の分析結果
interface ExpansionAnalysis {
  feasibility: 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedTime: string
  requiredChanges: string[]
  newFeatures: string[]
  codeModifications: CodeModification[]
  securityConsiderations: string[]
  performanceImpact: 'positive' | 'neutral' | 'negative'
}

interface CodeModification {
  file: string
  type: 'create' | 'modify' | 'delete'
  description: string
  code?: string
  priority: 'high' | 'medium' | 'low'
}

export class AIProductExpansion {
  // 自然言語リクエストの分析
  async analyzeExpansionRequest(request: SelfExpansionRequest): Promise<ExpansionAnalysis> {
    const prompt = `
あなたは熟練したソフトウェアアーキテクトです。以下のアプリケーションに対するユーザーの機能追加リクエストを分析してください。

アプリ情報:
- ID: ${request.appId}
- タイプ: ${request.appType}
- 既存機能: ${request.existingFeatures.join(', ')}

ユーザーリクエスト:
${request.userRequest}

現在のコード構造:
${request.currentCode.substring(0, 2000)}...

以下の形式で詳細な分析を提供してください:

1. 実現可能性 (high/medium/low)
2. 複雑度 (simple/moderate/complex)
3. 推定実装時間
4. 必要な変更箇所
5. 新機能の詳細
6. セキュリティ考慮事項
7. パフォーマンスへの影響

回答は日本語でお願いします。
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'あなたは優秀なソフトウェアアーキテクトとして、アプリケーションの機能拡張に関する詳細な分析を行います。技術的な実現可能性、セキュリティ、パフォーマンスを総合的に評価してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })

      const analysisText = response.choices[0]?.message?.content || ''
      
      // GPTの回答をパースして構造化データに変換
      return this.parseAnalysisResponse(analysisText)
    } catch (error) {
      console.error('Analysis error:', error)
      throw new Error('機能分析に失敗しました')
    }
  }

  // コード生成とファイル変更の実行
  async generateCodeModifications(request: SelfExpansionRequest, analysis: ExpansionAnalysis): Promise<CodeModification[]> {
    const modifications: CodeModification[] = []

    for (const change of analysis.requiredChanges) {
      const codePrompt = `
以下の要件に基づいて、具体的なコード変更を生成してください:

変更要求: ${change}
アプリタイプ: ${request.appType}
ユーザーリクエスト: ${request.userRequest}

現在のコード:
${request.currentCode}

要件:
1. TypeScript + Next.js 14 + Tailwind CSS で実装
2. 既存コードとの互換性を保持
3. セキュリティベストプラクティスに従う
4. パフォーマンスを考慮した実装
5. エラーハンドリングを含む

生成するコード:
- ファイルパス
- 変更タイプ (create/modify/delete)
- 完全なコード
- 変更の説明
`

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'あなたは高度なNext.js開発者として、既存のアプリケーションに新機能を安全かつ効率的に追加するコードを生成します。'
            },
            {
              role: 'user',
              content: codePrompt
            }
          ],
          temperature: 0.2,
          max_tokens: 3000,
        })

        const codeResponse = response.choices[0]?.message?.content || ''
        const modification = this.parseCodeModification(codeResponse, change)
        
        if (modification) {
          modifications.push(modification)
        }
      } catch (error) {
        console.error('Code generation error:', error)
      }
    }

    return modifications
  }

  // UI改善提案の生成
  async generateUIImprovements(request: SelfExpansionRequest): Promise<CodeModification[]> {
    const uiPrompt = `
以下のアプリケーションのUI/UXを改善する具体的な提案とコードを生成してください:

アプリタイプ: ${request.appType}
ユーザーリクエスト: ${request.userRequest}

改善領域:
1. ユーザーインターフェースの直感性向上
2. レスポンシブデザインの最適化
3. アクセシビリティの向上
4. アニメーションとインタラクション
5. 色彩とタイポグラフィの改善

shadcn/ui コンポーネントを活用し、Tailwind CSSで実装してください。
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'あなたはUX/UIデザインとフロントエンド開発の専門家として、ユーザーエクスペリエンスを劇的に向上させる改善案を提供します。'
          },
          {
            role: 'user',
            content: uiPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2500,
      })

      const uiResponse = response.choices[0]?.message?.content || ''
      return this.parseUIImprovements(uiResponse)
    } catch (error) {
      console.error('UI improvement generation error:', error)
      return []
    }
  }

  // 機能拡張の実行
  async executeExpansion(request: SelfExpansionRequest): Promise<{
    success: boolean
    analysis: ExpansionAnalysis
    modifications: CodeModification[]
    uiImprovements: CodeModification[]
    executionReport: string
  }> {
    try {
      // 1. リクエストの分析
      const analysis = await this.analyzeExpansionRequest(request)
      
      // 2. 実現可能性チェック
      if (analysis.feasibility === 'low') {
        return {
          success: false,
          analysis,
          modifications: [],
          uiImprovements: [],
          executionReport: '要求された機能は現在のアーキテクチャでは実現困難です。'
        }
      }

      // 3. コード変更の生成
      const modifications = await this.generateCodeModifications(request, analysis)
      
      // 4. UI改善の生成
      const uiImprovements = await this.generateUIImprovements(request)

      // 5. 実行レポートの生成
      const executionReport = await this.generateExecutionReport(analysis, modifications, uiImprovements)

      return {
        success: true,
        analysis,
        modifications,
        uiImprovements,
        executionReport
      }
    } catch (error) {
      console.error('Expansion execution error:', error)
      return {
        success: false,
        analysis: {} as ExpansionAnalysis,
        modifications: [],
        uiImprovements: [],
        executionReport: `拡張実行中にエラーが発生しました: ${error}`
      }
    }
  }

  // プライベートメソッド群
  private parseAnalysisResponse(response: string): ExpansionAnalysis {
    // GPTの回答をパースして構造化データに変換
    const lines = response.split('\n').map(line => line.trim()).filter(Boolean)
    
    return {
      feasibility: this.extractFeasibility(response),
      complexity: this.extractComplexity(response),
      estimatedTime: this.extractEstimatedTime(response),
      requiredChanges: this.extractRequiredChanges(response),
      newFeatures: this.extractNewFeatures(response),
      codeModifications: [],
      securityConsiderations: this.extractSecurityConsiderations(response),
      performanceImpact: this.extractPerformanceImpact(response)
    }
  }

  private parseCodeModification(response: string, description: string): CodeModification | null {
    // コード生成結果をパースして CodeModification オブジェクトに変換
    try {
      const filePathMatch = response.match(/ファイル(?:パス)?:\s*(.+)/i)
      const typeMatch = response.match(/変更タイプ:\s*(create|modify|delete)/i)
      const codeMatch = response.match(/```(?:typescript|tsx|ts)?\n([\s\S]+?)\n```/)

      return {
        file: filePathMatch?.[1]?.trim() || 'unknown',
        type: (typeMatch?.[1] as 'create' | 'modify' | 'delete') || 'modify',
        description,
        code: codeMatch?.[1] || '',
        priority: 'medium'
      }
    } catch (error) {
      console.error('Failed to parse code modification:', error)
      return null
    }
  }

  private parseUIImprovements(response: string): CodeModification[] {
    // UI改善提案をパースして配列に変換
    const improvements: CodeModification[] = []
    const sections = response.split(/\d+\./).filter(section => section.trim())

    sections.forEach((section, index) => {
      const codeMatch = section.match(/```(?:typescript|tsx|ts)?\n([\s\S]+?)\n```/)
      if (codeMatch) {
        improvements.push({
          file: `ui-improvement-${index + 1}.tsx`,
          type: 'modify',
          description: `${section.substring(0, 100)  }...`,
          code: codeMatch[1],
          priority: 'medium'
        })
      }
    })

    return improvements
  }

  private async generateExecutionReport(
    analysis: ExpansionAnalysis,
    modifications: CodeModification[],
    uiImprovements: CodeModification[]
  ): Promise<string> {
    return `
## 機能拡張実行レポート

### 分析結果
- **実現可能性**: ${analysis.feasibility}
- **複雑度**: ${analysis.complexity}
- **推定時間**: ${analysis.estimatedTime}
- **パフォーマンス影響**: ${analysis.performanceImpact}

### 実装された変更
- **コード変更**: ${modifications.length}件
- **UI改善**: ${uiImprovements.length}件

### 新機能
${analysis.newFeatures.map(feature => `- ${feature}`).join('\n')}

### セキュリティ考慮事項
${analysis.securityConsiderations.map(item => `- ${item}`).join('\n')}

### 次のステップ
1. 変更されたコードのテスト実行
2. ユーザーフィードバックの収集
3. パフォーマンス監視
4. 追加の最適化検討
`
  }

  // ヘルパーメソッド群
  private extractFeasibility(text: string): 'high' | 'medium' | 'low' {
    if (text.includes('実現可能性') && text.includes('high')) return 'high'
    if (text.includes('実現可能性') && text.includes('medium')) return 'medium'
    return 'low'
  }

  private extractComplexity(text: string): 'simple' | 'moderate' | 'complex' {
    if (text.includes('複雑度') && text.includes('simple')) return 'simple'
    if (text.includes('複雑度') && text.includes('complex')) return 'complex'
    return 'moderate'
  }

  private extractEstimatedTime(text: string): string {
    const timeMatch = text.match(/推定.*時間[：:]\s*(.+)/i)
    return timeMatch?.[1]?.trim() || '未設定'
  }

  private extractRequiredChanges(text: string): string[] {
    const changesSection = text.match(/必要な変更.*?(?:\n\n|\n(?=[0-9]))/s)
    if (!changesSection) return []
    
    return changesSection[0]
      .split('\n')
      .filter(line => line.trim() && (line.includes('-') || line.includes('•')))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
  }

  private extractNewFeatures(text: string): string[] {
    const featuresSection = text.match(/新機能.*?(?:\n\n|\n(?=[0-9]))/s)
    if (!featuresSection) return []
    
    return featuresSection[0]
      .split('\n')
      .filter(line => line.trim() && (line.includes('-') || line.includes('•')))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
  }

  private extractSecurityConsiderations(text: string): string[] {
    const securitySection = text.match(/セキュリティ.*?(?:\n\n|\n(?=[0-9]))/s)
    if (!securitySection) return []
    
    return securitySection[0]
      .split('\n')
      .filter(line => line.trim() && (line.includes('-') || line.includes('•')))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
  }

  private extractPerformanceImpact(text: string): 'positive' | 'neutral' | 'negative' {
    if (text.includes('パフォーマンス') && text.includes('positive')) return 'positive'
    if (text.includes('パフォーマンス') && text.includes('negative')) return 'negative'
    return 'neutral'
  }
}

// シングルトンインスタンス
export const aiProductExpansion = new AIProductExpansion()

// API用の関数
export async function handleSelfExpansionRequest(request: any) {
  try {
    const validatedRequest = SelfExpansionRequestSchema.parse(request)
    return await aiProductExpansion.executeExpansion(validatedRequest)
  } catch (error) {
    console.error('Self expansion request error:', error)
    throw new Error('自己拡張リクエストの処理に失敗しました')
  }
}