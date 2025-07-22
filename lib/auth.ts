import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { z } from 'zod'

// 環境変数の検証
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
})

const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

// クライアントサイド用Supabaseクライアント
export const createSupabaseClient = () => {
  return createClientComponentClient({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
}

// サーバーサイド用Supabaseクライアント
export const createSupabaseServerClient = () => {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  )
}

// セキュリティポリシー
export const SecurityPolicies = {
  // RLS有効化のためのSQL
  enableRLS: {
    apps: `
      ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
      
      -- アプリの作成者のみ読み書き可能
      CREATE POLICY "Users can view their own apps" ON apps
        FOR SELECT USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can create their own apps" ON apps
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        
      CREATE POLICY "Users can update their own apps" ON apps
        FOR UPDATE USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can delete their own apps" ON apps
        FOR DELETE USING (auth.uid() = user_id);
    `,
    
    transactions: `
      ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
      
      -- アプリの所有者のみトランザクションにアクセス可能
      CREATE POLICY "Users can view transactions for their apps" ON transactions
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM apps 
            WHERE apps.id = transactions.app_id 
            AND apps.user_id = auth.uid()
          )
        );
        
      CREATE POLICY "Users can create transactions for their apps" ON transactions
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM apps 
            WHERE apps.id = transactions.app_id 
            AND apps.user_id = auth.uid()
          )
        );
        
      CREATE POLICY "Users can update transactions for their apps" ON transactions
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM apps 
            WHERE apps.id = transactions.app_id 
            AND apps.user_id = auth.uid()
          )
        );
        
      CREATE POLICY "Users can delete transactions for their apps" ON transactions
        FOR DELETE USING (
          EXISTS (
            SELECT 1 FROM apps 
            WHERE apps.id = transactions.app_id 
            AND apps.user_id = auth.uid()
          )
        );
    `,
  },

  // データ暗号化設定
  encryption: {
    // 機密データのハッシュ化
    hashSensitiveData: (data: string): string => {
      // 本番環境では適切な暗号化ライブラリを使用
      return Buffer.from(data).toString('base64')
    },
    
    // データの匿名化
    anonymizeData: (data: any): any => {
      const anonymized = { ...data }
      if (anonymized.email) anonymized.email = anonymized.email.replace(/(.{2}).*(@.*)/, '$1***$2')
      if (anonymized.phone) anonymized.phone = anonymized.phone.replace(/(\d{3}).*(\d{4})/, '$1***$2')
      return anonymized
    }
  }
}

// 認証ヘルパー関数
export const AuthHelpers = {
  // ユーザーセッション取得
  async getCurrentUser() {
    const supabase = createSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth error:', error)
      return null
    }
    
    return session?.user || null
  },

  // セッション検証
  async validateSession(request: NextRequest) {
    try {
      const cookieStore = cookies()
      const supabase = createServerComponentClient({ cookies: () => cookieStore })
      const { data: { session } } = await supabase.auth.getSession()
      
      return session?.user || null
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  },

  // 認証が必要なルート保護
  async protectedRoute(request: NextRequest, next: () => Promise<NextResponse>) {
    const user = await AuthHelpers.validateSession(request)
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    return next()
  },

  // ロール基盤アクセス制御
  async checkUserRole(userId: string, requiredRole: 'user' | 'admin' | 'premium') {
    const supabase = createSupabaseClient()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single()
    
    const roleHierarchy = { user: 1, premium: 2, admin: 3 }
    const userLevel = roleHierarchy[profile?.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole]
    
    return userLevel >= requiredLevel
  }
}

// セキュリティミドルウェア
export const SecurityMiddleware = {
  // リクエスト制限
  rateLimit: new Map<string, { count: number; resetTime: number }>(),
  
  // APIレート制限チェック
  checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
    const now = Date.now()
    const key = ip
    const record = this.rateLimit.get(key)
    
    if (!record || now > record.resetTime) {
      this.rateLimit.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (record.count >= limit) {
      return false
    }
    
    record.count++
    return true
  },

  // 入力値サニタイゼーション
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim()
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item))
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }
    
    return input
  },

  // SQLインジェクション防止
  validateQuery(query: string): boolean {
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(-{2}|\/\*|\*\/)/,
      /(\b(OR|AND)\b.*[=<>])/i
    ]
    
    return !dangerousPatterns.some(pattern => pattern.test(query))
  }
}

// 監査ログ
export const AuditLogger = {
  async log(action: string, userId: string, details: any) {
    const supabase = createSupabaseClient()
    
    await supabase.from('audit_logs').insert({
      action,
      user_id: userId,
      details: SecurityPolicies.encryption.anonymizeData(details),
      timestamp: new Date().toISOString(),
      ip_address: 'masked', // 本番環境では実際のIPを記録
    })
  }
}

export default {
  createSupabaseClient,
  createSupabaseServerClient,
  SecurityPolicies,
  AuthHelpers,
  SecurityMiddleware,
  AuditLogger,
}