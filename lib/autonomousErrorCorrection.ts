interface ErrorPattern {
  pattern: RegExp
  description: string
  severity: 'error' | 'warning' | 'info'
  category: 'typescript' | 'eslint' | 'runtime' | 'syntax' | 'import' | 'accessibility'
  autoFix: (code: string, match: RegExpMatchArray) => string
}

interface CorrectionResult {
  success: boolean
  originalIssues: string[]
  fixedIssues: string[]
  remainingIssues: string[]
  appliedFixes: string[]
  iterationsUsed: number
  finalCode: string
}

export class AutonomousErrorCorrection {
  private errorPatterns: ErrorPattern[]
  private maxIterations: number
  private correctionHistory: string[]

  constructor(maxIterations: number = 3) {
    this.maxIterations = maxIterations
    this.correctionHistory = []
    this.errorPatterns = this.initializeErrorPatterns()
  }

  /**
   * 自律的なエラー検出と修正を実行
   */
  async correctCode(
    code: string,
    filePath: string,
    context: {
      isReactComponent?: boolean
      isTypeScriptFile?: boolean
      dependencies?: string[]
    } = {}
  ): Promise<CorrectionResult> {
    console.log(`[AutoCorrect] Starting correction for ${filePath}`)
    
    let currentCode = code
    let iteration = 0
    const originalIssues: string[] = []
    const fixedIssues: string[] = []
    const appliedFixes: string[] = []

    // 初期エラー検出
    const initialIssues = await this.detectIssues(currentCode, filePath, context)
    originalIssues.push(...initialIssues)

    while (iteration < this.maxIterations) {
      console.log(`[AutoCorrect] Iteration ${iteration + 1}/${this.maxIterations}`)
      
      const issues = await this.detectIssues(currentCode, filePath, context)
      
      if (issues.length === 0) {
        console.log(`[AutoCorrect] No issues found, correction complete`)
        break
      }

      console.log(`[AutoCorrect] Found ${issues.length} issues to fix`)
      
      let iterationFixed = false
      
      for (const issue of issues) {
        const fixResult = await this.attemptFix(currentCode, issue, filePath, context)
        
        if (fixResult.success) {
          currentCode = fixResult.fixedCode
          fixedIssues.push(issue)
          appliedFixes.push(fixResult.description)
          iterationFixed = true
          console.log(`[AutoCorrect] Fixed: ${fixResult.description}`)
        }
      }

      if (!iterationFixed) {
        console.log(`[AutoCorrect] No fixes applied in iteration ${iteration + 1}, stopping`)
        break
      }

      iteration++
    }

    const remainingIssues = await this.detectIssues(currentCode, filePath, context)

    return {
      success: remainingIssues.length === 0,
      originalIssues,
      fixedIssues,
      remainingIssues,
      appliedFixes,
      iterationsUsed: iteration,
      finalCode: currentCode
    }
  }

  /**
   * エラーパターンの初期化
   */
  private initializeErrorPatterns(): ErrorPattern[] {
    return [
      // TypeScript エラー
      {
        pattern: /Property '(\w+)' does not exist on type/,
        description: 'Missing property type',
        severity: 'error',
        category: 'typescript',
        autoFix: (code, match) => {
          // 基本的な型定義の追加
          const interfaceName = `${match[1].charAt(0).toUpperCase()}${match[1].slice(1)}Props`
          const interfaceDefinition = `interface ${interfaceName} {\n  ${match[1]}: any\n}\n\n`
          return interfaceDefinition + code
        }
      },
      {
        pattern: /Argument of type '.*' is not assignable to parameter of type/,
        description: 'Type mismatch in function argument',
        severity: 'error',
        category: 'typescript',
        autoFix: (code, match) => {
          // 型アサーション追加
          return code.replace(match[0], `${match[0]} // Type assertion may be needed`)
        }
      },
      {
        pattern: /Variable '(\w+)' is used before being assigned/,
        description: 'Variable used before assignment',
        severity: 'error',
        category: 'typescript',
        autoFix: (code, match) => {
          const varName = match[1]
          // 初期値を設定
          return code.replace(
            new RegExp(`let ${varName}(?:\\s*:|\\s*=|\\s*;)`),
            `let ${varName}: any = null`
          )
        }
      },

      // ESLint エラー
      {
        pattern: /React must be in scope when using JSX/,
        description: 'Missing React import',
        severity: 'error',
        category: 'eslint',
        autoFix: (code, match) => {
          if (!code.includes(`import React`)) {
            return `import React from 'react'\n${code}`
          }
          return code
        }
      },
      {
        pattern: /'(\w+)' is defined but never used/,
        description: 'Unused variable',
        severity: 'warning',
        category: 'eslint',
        autoFix: (code, match) => {
          const varName = match[1]
          // 変数名にアンダースコアを追加してESLintの警告を回避
          return code.replace(
            new RegExp(`\\b${varName}\\b`, 'g'),
            `_${varName}`
          )
        }
      },
      {
        pattern: /Unexpected console statement/,
        description: 'Console statement in production code',
        severity: 'warning',
        category: 'eslint',
        autoFix: (code, match) => {
          // console.logをコメントアウト
          return code.replace(/console\.(log|warn|error|info)/g, '// console.$1')
        }
      },

      // インポートエラー
      {
        pattern: /Cannot find module '(.*)'/,
        description: 'Missing module import',
        severity: 'error',
        category: 'import',
        autoFix: (code, match) => {
          const moduleName = match[1]
          // 相対パスの修正を試行
          if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            return code.replace(moduleName, `${moduleName}.ts`)
          }
          return code
        }
      },
      {
        pattern: /Module '".*"' has no exported member '(\w+)'/,
        description: 'Invalid named import',
        severity: 'error',
        category: 'import',
        autoFix: (code, match) => {
          const memberName = match[1]
          // デフォルトインポートに変更
          return code.replace(
            new RegExp(`import\\s*{[^}]*${memberName}[^}]*}\\s*from`),
            `import ${memberName} from`
          )
        }
      },

      // React特有のエラー
      {
        pattern: /React Hook "(\w+)" is called conditionally/,
        description: 'Conditional hook usage',
        severity: 'error',
        category: 'eslint',
        autoFix: (code, match) => {
          // フックの呼び出しをコンポーネントの最上部に移動
          const hookName = match[1]
          const lines = code.split('\n')
          const hookPattern = new RegExp(`\\s*${hookName}\\(`)
          
          const hookLines = lines.filter(line => hookPattern.test(line))
          const nonHookLines = lines.filter(line => !hookPattern.test(line))
          
          return [...nonHookLines.slice(0, 1), ...hookLines, ...nonHookLines.slice(1)].join('\n')
        }
      },
      {
        pattern: /Each child in a list should have a unique "key" prop/,
        description: 'Missing key prop in list',
        severity: 'warning',
        category: 'eslint',
        autoFix: (code, match) => {
          // map関数にkey属性を追加
          return code.replace(
            /\.map\((.*?)\s*=>\s*<(\w+)/g,
            '.map(($1, index) => <$2 key={index}'
          )
        }
      },

      // アクセシビリティエラー
      {
        pattern: /img elements must have an alt prop/,
        description: 'Missing alt attribute',
        severity: 'error',
        category: 'accessibility',
        autoFix: (code, match) => {
          return code.replace(/<img(?![^>]*alt=)/g, '<img alt=""')
        }
      },
      {
        pattern: /Anchors must have content/,
        description: 'Empty anchor tag',
        severity: 'error',
        category: 'accessibility',
        autoFix: (code, match) => {
          return code.replace(/<a([^>]*)><\/a>/g, '<a$1>Link</a>')
        }
      },

      // 構文エラー
      {
        pattern: /Unexpected token/,
        description: 'Syntax error',
        severity: 'error',
        category: 'syntax',
        autoFix: (code, match) => {
          // 基本的な構文修正
          return code
            .replace(/,(\s*[}\]])/g, '$1') // 末尾のカンマを削除
            .replace(/([{\[])\s*,/g, '$1') // 先頭のカンマを削除
        }
      },

      // 型定義エラー
      {
        pattern: /Type '(.*)' is not assignable to type '(.*)'/,
        description: 'Type assignment error',
        severity: 'error',
        category: 'typescript',
        autoFix: (code, match) => {
          // as演算子を使用した型アサーションを追加
          const fromType = match[1]
          const toType = match[2]
          
          if (fromType.includes('null') || fromType.includes('undefined')) {
            // nullチェックを追加
            return code.replace(/(\w+)\s*\?\s*(\w+)/g, '$1 ? $2 : null')
          }
          
          return code
        }
      }
    ]
  }

  /**
   * コードの問題を検出
   */
  private async detectIssues(
    code: string,
    filePath: string,
    context: any
  ): Promise<string[]> {
    const issues: string[] = []

    // パターンマッチングによる問題検出
    for (const pattern of this.errorPatterns) {
      const matches = code.match(pattern.pattern)
      if (matches) {
        issues.push(`${pattern.category}: ${pattern.description}`)
      }
    }

    // TypeScript特有のチェック
    if (context.isTypeScriptFile || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      issues.push(...this.detectTypeScriptIssues(code))
    }

    // React特有のチェック
    if (context.isReactComponent || code.includes('jsx') || code.includes('React')) {
      issues.push(...this.detectReactIssues(code))
    }

    // 一般的なJavaScript問題
    issues.push(...this.detectJavaScriptIssues(code))

    return [...new Set(issues)] // 重複を除去
  }

  /**
   * TypeScript特有の問題を検出
   */
  private detectTypeScriptIssues(code: string): string[] {
    const issues: string[] = []

    // any型の使用
    if (code.includes(': any')) {
      issues.push('typescript: Excessive use of any type')
    }

    // 未定義変数の使用
    const variableUsage = code.match(/\b(\w+)\.\w+/g)
    if (variableUsage) {
      variableUsage.forEach(usage => {
        const varName = usage.split('.')[0]
        if (!code.includes(`const ${varName}`) && 
            !code.includes(`let ${varName}`) && 
            !code.includes(`var ${varName}`) &&
            !code.includes(`function ${varName}`) &&
            !['props', 'state', 'this', 'window', 'document', 'console'].includes(varName)) {
          issues.push(`typescript: Undefined variable '${varName}'`)
        }
      })
    }

    return issues
  }

  /**
   * React特有の問題を検出
   */
  private detectReactIssues(code: string): string[] {
    const issues: string[] = []

    // useState、useEffectの不適切な使用
    if (code.includes('useState') || code.includes('useEffect')) {
      if (!code.includes(`import React`) && !code.includes(`import { useState`)) {
        issues.push('react: Missing React import for hooks')
      }
    }

    // JSX内でのkey属性の不足
    const mapUsage = code.match(/\.map\([^)]*\)\s*=>\s*</g)
    if (mapUsage && !code.includes('key=')) {
      issues.push('react: Missing key prop in list rendering')
    }

    // イベントハンドラーの不適切な定義
    const inlineHandlers = code.match(/on\w+\s*=\s*{[^}]*}/g)
    if (inlineHandlers) {
      issues.push('react: Inline event handlers may cause re-renders')
    }

    return issues
  }

  /**
   * JavaScript一般の問題を検出
   */
  private detectJavaScriptIssues(code: string): string[] {
    const issues: string[] = []

    // console.log文の残存
    if (code.includes('console.log')) {
      issues.push('javascript: Console statements in production code')
    }

    // 等価演算子の使用
    if (code.includes('==') && !code.includes('===')) {
      issues.push('javascript: Use strict equality operator')
    }

    // varの使用
    if (code.includes('var ')) {
      issues.push('javascript: Use let or const instead of var')
    }

    // 未使用のインポート
    const imports = code.match(/import.*from/g)
    if (imports) {
      imports.forEach(importStatement => {
        const match = importStatement.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))/)
        if (match) {
          const importedNames = match[1] ? match[1].split(',').map(s => s.trim()) : [match[2] || match[3]]
          importedNames.forEach(name => {
            if (name && !code.includes(name.replace(/\s+as\s+\w+/, ''))) {
              issues.push(`javascript: Unused import '${name}'`)
            }
          })
        }
      })
    }

    return issues
  }

  /**
   * 単一の問題の修正を試行
   */
  private async attemptFix(
    code: string,
    issue: string,
    filePath: string,
    context: any
  ): Promise<{ success: boolean; fixedCode: string; description: string }> {
    
    // 該当するパターンを検索
    for (const pattern of this.errorPatterns) {
      if (issue.includes(pattern.description) || issue.includes(pattern.category)) {
        const match = code.match(pattern.pattern)
        if (match) {
          try {
            const fixedCode = pattern.autoFix(code, match)
            if (fixedCode !== code) {
              return {
                success: true,
                fixedCode,
                description: `Applied ${pattern.category} fix: ${pattern.description}`
              }
            }
          } catch (error) {
            console.error(`[AutoCorrect] Error applying fix for ${pattern.description}:`, error)
          }
        }
      }
    }

    // カスタム修正ロジック
    const customFix = await this.attemptCustomFix(code, issue, context)
    if (customFix.success) {
      return customFix
    }

    return { success: false, fixedCode: code, description: 'No applicable fix found' }
  }

  /**
   * カスタム修正ロジック
   */
  private async attemptCustomFix(
    code: string,
    issue: string,
    context: any
  ): Promise<{ success: boolean; fixedCode: string; description: string }> {
    
    let fixedCode = code

    // TypeScript型エラーの修正
    if (issue.includes('typescript')) {
      if (issue.includes('any type')) {
        // any型をより具体的な型に置換
        fixedCode = fixedCode.replace(/:\s*any\b/g, ': unknown')
      }
      
      if (issue.includes('Undefined variable')) {
        const varMatch = issue.match(/'(\w+)'/)
        if (varMatch) {
          const varName = varMatch[1]
          // 変数定義を追加
          fixedCode = `const ${varName}: any = {}\n${fixedCode}`
        }
      }
    }

    // React特有の修正
    if (issue.includes('react')) {
      if (issue.includes('Missing React import')) {
        if (!fixedCode.includes('import React')) {
          fixedCode = `import React from 'react'\n${fixedCode}`
        }
      }
      
      if (issue.includes('Missing key prop')) {
        fixedCode = fixedCode.replace(
          /\.map\((.*?)\s*=>\s*<(\w+)(?![^>]*key=)/g,
          '.map(($1, index) => <$2 key={index}'
        )
      }
      
      if (issue.includes('Inline event handlers')) {
        // useCallbackを使用したイベントハンドラーの最適化
        if (!fixedCode.includes('useCallback')) {
          fixedCode = fixedCode.replace(
            /import React/,
            'import React, { useCallback }'
          )
        }
      }
    }

    // JavaScript一般の修正
    if (issue.includes('javascript')) {
      if (issue.includes('Console statements')) {
        fixedCode = fixedCode.replace(/console\.(log|warn|error|info)/g, '// console.$1')
      }
      
      if (issue.includes('strict equality')) {
        fixedCode = fixedCode.replace(/([^=!])=([^=])/g, '$1===$2')
      }
      
      if (issue.includes('var')) {
        fixedCode = fixedCode.replace(/\bvar\b/g, 'let')
      }
      
      if (issue.includes('Unused import')) {
        const importMatch = issue.match(/'(\w+)'/)
        if (importMatch) {
          const unusedImport = importMatch[1]
          // 未使用のインポートを削除
          fixedCode = fixedCode.replace(
            new RegExp(`import\\s+{[^}]*${unusedImport}[^}]*}\\s+from[^\\n]*\\n?`, 'g'),
            ''
          )
          fixedCode = fixedCode.replace(
            new RegExp(`import\\s+${unusedImport}\\s+from[^\\n]*\\n?`, 'g'),
            ''
          )
        }
      }
    }

    const success = fixedCode !== code
    return {
      success,
      fixedCode,
      description: success ? `Applied custom fix for: ${issue}` : 'No custom fix available'
    }
  }

  /**
   * 修正履歴を記録
   */
  recordCorrection(description: string): void {
    this.correctionHistory.push(`${new Date().toISOString()}: ${description}`)
  }

  /**
   * 修正履歴を取得
   */
  getCorrectionHistory(): string[] {
    return [...this.correctionHistory]
  }

  /**
   * 統計情報を取得
   */
  getStatistics(): {
    totalCorrections: number
    correctionsByCategory: Record<string, number>
    averageIterations: number
  } {
    const categories = this.errorPatterns.reduce((acc, pattern) => {
      acc[pattern.category] = (acc[pattern.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalCorrections: this.correctionHistory.length,
      correctionsByCategory: categories,
      averageIterations: this.maxIterations
    }
  }
}

// 使用例
export async function correctGeneratedCode(
  code: string,
  filePath: string,
  options: {
    maxIterations?: number
    isReactComponent?: boolean
    isTypeScriptFile?: boolean
    dependencies?: string[]
  } = {}
): Promise<CorrectionResult> {
  const corrector = new AutonomousErrorCorrection(options.maxIterations)
  
  return await corrector.correctCode(code, filePath, {
    isReactComponent: options.isReactComponent,
    isTypeScriptFile: options.isTypeScriptFile,
    dependencies: options.dependencies
  })
}

export default AutonomousErrorCorrection