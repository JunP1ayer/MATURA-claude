/**
 * MATURA プロンプトチューナー
 * 構造データを分析してGPTへの送信を最適化
 */

import { checkStructureQuality, enhanceStructureForPrompt, type QualityCheckResult } from './validation'

export interface PromptOptimizationResult {
  optimizedPrompt: string
  qualityCheck: QualityCheckResult
  enhancements: string[]
  promptStrategy: 'basic' | 'enhanced' | 'advanced'
  estimatedOutputQuality: number
}

export interface StructurePromptConfig {
  includeExamples: boolean
  emphasizeClarity: boolean
  addTechnicalSpecs: boolean
  includeUIGuidelines: boolean
  useProfessionalTone: boolean
}

export class PromptTuner {
  private defaultConfig: StructurePromptConfig = {
    includeExamples: true,
    emphasizeClarity: true,
    addTechnicalSpecs: true,
    includeUIGuidelines: true,
    useProfessionalTone: true
  }

  /**
   * メイン最適化機能
   */
  optimizeForGeneration(
    structureData: any,
    config: Partial<StructurePromptConfig> = {}
  ): PromptOptimizationResult {
    const finalConfig = { ...this.defaultConfig, ...config }
    
    // 構造データの品質チェック
    const qualityCheck = checkStructureQuality(structureData)
    
    // 構造データの強化
    const { enhanced, modifications } = enhanceStructureForPrompt(structureData)
    
    // プロンプト戦略の決定
    const strategy = this.determinePromptStrategy(qualityCheck)
    
    // 最適化されたプロンプトの生成
    const optimizedPrompt = this.generateOptimizedPrompt(enhanced, finalConfig, strategy)
    
    // 出力品質の予測
    const estimatedOutputQuality = this.predictOutputQuality(qualityCheck, strategy)
    
    return {
      optimizedPrompt,
      qualityCheck,
      enhancements: modifications,
      promptStrategy: strategy,
      estimatedOutputQuality
    }
  }

  /**
   * プロンプト戦略の決定
   */
  private determinePromptStrategy(qualityCheck: QualityCheckResult): 'basic' | 'enhanced' | 'advanced' {
    if (qualityCheck.qualityScore >= 85 && qualityCheck.readyForGeneration) {
      return 'advanced'
    }
    if (qualityCheck.qualityScore >= 70) {
      return 'enhanced'
    }
    return 'basic'
  }

  /**
   * 最適化されたプロンプトの生成
   */
  private generateOptimizedPrompt(
    structureData: any,
    config: StructurePromptConfig,
    strategy: 'basic' | 'enhanced' | 'advanced'
  ): string {
    let prompt = ""

    // 基本プロンプト構造
    prompt += this.getBasePrompt(strategy)
    
    // 構造データの整理
    prompt += this.formatStructureData(structureData, config)
    
    // 技術仕様の追加
    if (config.addTechnicalSpecs) {
      prompt += this.getTechnicalSpecifications(strategy)
    }
    
    // UI/UXガイドラインの追加
    if (config.includeUIGuidelines) {
      prompt += this.getUIGuidelines(strategy)
    }
    
    // 品質要求の追加
    prompt += this.getQualityRequirements(strategy)
    
    // 例の追加
    if (config.includeExamples && strategy !== 'basic') {
      prompt += this.getExamples(strategy)
    }

    return prompt
  }

  /**
   * ベースプロンプト
   */
  private getBasePrompt(strategy: 'basic' | 'enhanced' | 'advanced'): string {
    const prompts = {
      basic: `高品質なNext.jsウェブアプリケーションを生成してください。以下の構造データに基づいて実装します：\n\n`,
      
      enhanced: `プロフェッショナルグレードのNext.jsウェブアプリケーションを生成してください。
モダンなWebデザイン原則とベストプラクティスに従い、以下の構造データを基に実装します：\n\n`,
      
      advanced: `最高品質のNext.jsウェブアプリケーションを生成してください。
企業レベルの品質基準、アクセシビリティ、パフォーマンス最適化、SEO対応を含む
包括的な実装を以下の構造データに基づいて行います：\n\n`
    }
    
    return prompts[strategy]
  }

  /**
   * 構造データのフォーマット
   */
  private formatStructureData(structureData: any, config: StructurePromptConfig): string {
    let formatted = `## プロダクト構造分析\n\n`
    
    if (structureData.why) {
      formatted += `### 🎯 なぜ (Why)\n${structureData.why}\n\n`
    }
    
    if (structureData.who) {
      formatted += `### 👥 誰のために (Who)\n${structureData.who}\n\n`
    }
    
    if (structureData.what && Array.isArray(structureData.what)) {
      formatted += `### ⚙️ 何を提供するか (What)\n`
      structureData.what.forEach((item: string, index: number) => {
        formatted += `${index + 1}. ${item}\n`
      })
      formatted += `\n`
    }
    
    if (structureData.how) {
      formatted += `### 🛠️ どのように実現するか (How)\n${structureData.how}\n\n`
    }
    
    if (structureData.impact) {
      formatted += `### 📈 期待される影響 (Impact)\n${structureData.impact}\n\n`
    }
    
    return formatted
  }

  /**
   * 技術仕様
   */
  private getTechnicalSpecifications(strategy: 'basic' | 'enhanced' | 'advanced'): string {
    const specs = {
      basic: `## 技術要件
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- レスポンシブデザイン

`,
      enhanced: `## 技術仕様
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui コンポーネント
- レスポンシブデザイン (モバイルファースト)
- パフォーマンス最適化
- アクセシビリティ考慮 (WCAG 2.1)

`,
      advanced: `## 高度技術仕様
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui コンポーネントライブラリ
- レスポンシブデザイン (モバイルファースト)
- パフォーマンス最適化 (Core Web Vitals対応)
- アクセシビリティ (WCAG 2.1 AA準拠)
- SEO最適化 (メタタグ、構造化データ)
- エラーハンドリング + ローディング状態
- 型安全性の確保

`
    }
    
    return specs[strategy]
  }

  /**
   * UI/UXガイドライン
   */
  private getUIGuidelines(strategy: 'basic' | 'enhanced' | 'advanced'): string {
    const guidelines = {
      basic: `## UI/UXガイドライン
- 直感的で使いやすいインターフェース
- 一貫性のあるデザイン
- 明確なナビゲーション

`,
      enhanced: `## UI/UXガイドライン
- モダンでプロフェッショナルなデザイン
- 直感的で使いやすいインターフェース
- 一貫性のあるデザインシステム
- 効果的なビジュアルヒエラルキー
- スムーズなアニメーション効果

`,
      advanced: `## 高品質UI/UXガイドライン
- エンタープライズグレードのデザイン品質
- ユーザー中心設計 (UCD) の原則
- 完全なデザインシステム一貫性
- 効果的なビジュアルヒエラルキーと情報アーキテクチャ
- 適切なマイクロインタラクション
- エモーショナルデザイン要素
- ユーザビリティテスト対応

`
    }
    
    return guidelines[strategy]
  }

  /**
   * 品質要求
   */
  private getQualityRequirements(strategy: 'basic' | 'enhanced' | 'advanced'): string {
    const requirements = {
      basic: `## 品質要求
- 動作するコード
- 基本的なエラー処理
- クリーンなコード構造

`,
      enhanced: `## 品質要求
- プロダクションレディなコード
- 包括的なエラー処理
- クリーンアーキテクチャ
- コメント付きコード
- パフォーマンス考慮

`,
      advanced: `## 高品質要求
- エンタープライズグレードのコード品質
- 包括的なエラー処理とフォールバック
- クリーンアーキテクチャとSOLID原則
- 詳細なコメントとドキュメンテーション
- パフォーマンス最適化とメトリクス対応
- セキュリティベストプラクティス
- テスタブルなコード設計

`
    }
    
    return requirements[strategy]
  }

  /**
   * 例とベストプラクティス
   */
  private getExamples(strategy: 'basic' | 'enhanced' | 'advanced'): string {
    if (strategy === 'basic') return ''
    
    return `## 実装例とベストプラクティス
- モダンなReactパターン (hooks, context)
- 適切なcomponent分割
- TypeScript型定義の活用
- アクセシビリティ属性の実装
- パフォーマンス最適化手法

`
  }

  /**
   * 出力品質の予測
   */
  private predictOutputQuality(qualityCheck: QualityCheckResult, strategy: 'basic' | 'enhanced' | 'advanced'): number {
    const baseQuality = qualityCheck.qualityScore
    
    // 戦略による品質ボーナス
    const strategyBonus = {
      basic: 0,
      enhanced: 10,
      advanced: 20
    }
    
    // 一貫性ボーナス
    const consistencyBonus = qualityCheck.consistency > 80 ? 5 : 0
    
    // 完全性ボーナス
    const completenessBonus = qualityCheck.completeness > 90 ? 5 : 0
    
    const predicted = Math.min(100, baseQuality + strategyBonus[strategy] + consistencyBonus + completenessBonus)
    
    return Math.round(predicted)
  }

  /**
   * 構造データの自動修正提案
   */
  autoSuggestImprovements(structureData: any): string[] {
    const suggestions: string[] = []
    const qualityCheck = checkStructureQuality(structureData)
    
    qualityCheck.issues.forEach(issue => {
      if (issue.type === 'error') {
        suggestions.push(`🚨 ${issue.field}: ${issue.message}`)
      } else if (issue.type === 'warning') {
        suggestions.push(`⚠️ ${issue.field}: ${issue.message}`)
      } else {
        suggestions.push(`💡 ${issue.field}: ${issue.message}`)
      }
    })
    
    qualityCheck.recommendations.forEach(rec => {
      suggestions.push(`✨ 推奨: ${rec}`)
    })
    
    return suggestions
  }
}

// デフォルトインスタンス
export const promptTuner = new PromptTuner()

// ヘルパー関数
export function quickOptimize(structureData: any): PromptOptimizationResult {
  return promptTuner.optimizeForGeneration(structureData)
}

export function validateAndOptimize(structureData: any): {
  isReady: boolean
  optimization: PromptOptimizationResult
  criticalIssues: string[]
} {
  const optimization = promptTuner.optimizeForGeneration(structureData)
  
  const criticalIssues = optimization.qualityCheck.issues
    .filter(issue => issue.type === 'error')
    .map(issue => `${issue.field}: ${issue.message}`)
  
  return {
    isReady: optimization.qualityCheck.readyForGeneration,
    optimization,
    criticalIssues
  }
}