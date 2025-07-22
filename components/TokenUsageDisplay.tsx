'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  CreditCard, 
  Info, 
  AlertTriangle, 
  Crown, 
  TrendingUp,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TokenUsage {
  used: number
  limit: number
  resetDate: string
  plan: 'free' | 'pro' | 'enterprise'
  estimatedCost?: number
}

interface TokenUsageDisplayProps {
  usage: TokenUsage
  onUpgrade?: () => void
  onBuyTokens?: () => void
  className?: string
  compact?: boolean
}

const planConfigs = {
  free: {
    name: 'Free',
    color: 'bg-gray-100 text-gray-800',
    icon: <Zap className="h-4 w-4" />,
    features: ['月10,000トークン', '基本サポート', '3つまでのプロジェクト']
  },
  pro: {
    name: 'Pro',
    color: 'bg-blue-100 text-blue-800',
    icon: <Crown className="h-4 w-4" />,
    features: ['月100,000トークン', '優先サポート', '無制限プロジェクト', '高速生成']
  },
  enterprise: {
    name: 'Enterprise',
    color: 'bg-purple-100 text-purple-800',
    icon: <TrendingUp className="h-4 w-4" />,
    features: ['無制限トークン', '専用サポート', 'カスタム統合', 'SLA保証']
  }
}

export default function TokenUsageDisplay({
  usage,
  onUpgrade,
  onBuyTokens,
  className = '',
  compact = false
}: TokenUsageDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const usagePercentage = (usage.used / usage.limit) * 100
  const remainingTokens = usage.limit - usage.used
  const planConfig = planConfigs[usage.plan]

  const getUsageStatus = () => {
    if (usagePercentage >= 90) {
      return { type: 'critical', message: 'トークンが不足しています', color: 'text-red-600' }
    } else if (usagePercentage >= 75) {
      return { type: 'warning', message: 'トークンの残量が少なくなっています', color: 'text-yellow-600' }
    } else if (usagePercentage >= 50) {
      return { type: 'normal', message: '良好な使用状況です', color: 'text-blue-600' }
    } else {
      return { type: 'excellent', message: '十分なトークンがあります', color: 'text-green-600' }
    }
  }

  const status = getUsageStatus()

  // コンパクト表示
  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Badge variant="outline" className={planConfig.color}>
          {planConfig.icon}
          <span className="ml-1">{planConfig.name}</span>
        </Badge>
        
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                usagePercentage >= 90 ? 'bg-red-500' :
                usagePercentage >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-mono text-gray-600">
            {remainingTokens.toLocaleString()}
          </span>
        </div>

        {usagePercentage >= 75 && (
          <Button variant="outline" size="sm" onClick={onUpgrade}>
            <Crown className="h-3 w-3 mr-1" />
            アップグレード
          </Button>
        )}
      </div>
    )
  }

  // フル表示
  return (
    <div className={`w-full max-w-md ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>トークン使用状況</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={planConfig.color}>
                {planConfig.icon}
                <span className="ml-1">{planConfig.name}プラン</span>
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 使用状況バー */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">使用量</span>
              <span className="font-mono">
                {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
              </span>
            </div>
            
            <Progress 
              value={usagePercentage} 
              className={`h-3 ${
                usagePercentage >= 90 ? '[&>div]:bg-red-500' :
                usagePercentage >= 75 ? '[&>div]:bg-yellow-500' :
                '[&>div]:bg-green-500'
              }`}
            />
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{Math.round(usagePercentage)}% 使用済み</span>
              <span>リセット: {new Date(usage.resetDate).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>

          {/* ステータスメッセージ */}
          <Alert className={`
            ${status.type === 'critical' ? 'bg-red-50 border-red-200' :
              status.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'}
          `}>
            {status.type === 'critical' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            <AlertDescription>
              <span className={status.color}>{status.message}</span>
            </AlertDescription>
          </Alert>

          {/* 詳細情報 */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 bg-gray-50 p-3 rounded-lg"
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">残りトークン</span>
                    <div className="font-mono font-semibold text-lg">
                      {remainingTokens.toLocaleString()}
                    </div>
                  </div>
                  
                  {usage.estimatedCost && (
                    <div>
                      <span className="text-gray-600">今月の推定コスト</span>
                      <div className="font-mono font-semibold text-lg">
                        ¥{usage.estimatedCost.toFixed(0)}
                      </div>
                    </div>
                  )}
                </div>

                {/* プラン機能 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">現在のプラン特典</h4>
                  <ul className="space-y-1">
                    {planConfig.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* アクションボタン */}
          <div className="flex flex-col space-y-2">
            {usage.plan === 'free' && usagePercentage >= 50 && (
              <Button onClick={onUpgrade} className="w-full bg-blue-600 hover:bg-blue-700">
                <Crown className="h-4 w-4 mr-2" />
                Proプランにアップグレード
              </Button>
            )}

            {usage.plan !== 'enterprise' && usagePercentage >= 75 && (
              <Button variant="outline" onClick={onBuyTokens} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                追加トークンを購入
              </Button>
            )}

            <Button variant="ghost" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              使用状況の詳細を表示
            </Button>
          </div>

          {/* プラン比較リンク */}
          {usage.plan === 'free' && (
            <div className="text-center">
              <Button variant="link" className="text-xs text-blue-600 p-0">
                全プランの機能比較を見る →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// デモ用のフック（実際の実装ではAPIから取得）
export function useTokenUsage(): TokenUsage {
  // 実際の実装では、APIやストレージから取得
  return {
    used: 7500,
    limit: 10000,
    resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15日後
    plan: 'free',
    estimatedCost: 0
  }
}

// プラン情報を取得するユーティリティ
export const getPlanInfo = (plan: 'free' | 'pro' | 'enterprise') => {
  return planConfigs[plan]
}

// トークン使用量に基づく推奨アクション
export const getRecommendedAction = (usage: TokenUsage) => {
  const usagePercentage = (usage.used / usage.limit) * 100

  if (usage.plan === 'free' && usagePercentage >= 80) {
    return {
      type: 'upgrade',
      title: 'アップグレードをお勧めします',
      description: 'Proプランで10倍のトークンをご利用いただけます',
      action: 'プランをアップグレード'
    }
  }

  if (usagePercentage >= 90) {
    return {
      type: 'buy_tokens',
      title: '追加トークンが必要です',
      description: 'トークンを追加購入して作業を継続できます',
      action: 'トークンを購入'
    }
  }

  return null
}