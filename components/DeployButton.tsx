'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  ExternalLink, 
  Settings, 
  Check, 
  AlertCircle, 
  Copy,
  Globe,
  Github,
  Zap,
  Info
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DeploymentConfig {
  projectName: string
  webhookUrl?: string
  gitRepository?: string
  environmentVars?: Record<string, string>
}

interface DeployButtonProps {
  generatedCode?: {
    html: string
    css?: string
    javascript?: string
    framework?: string
    dependencies?: string[]
  }
  onDeploy?: (config: DeploymentConfig) => Promise<{ success: boolean; url?: string; error?: string }>
  className?: string
}

export default function DeployButton({
  generatedCode,
  onDeploy,
  className = ''
}: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    projectName: `matura-app-${Date.now()}`,
    webhookUrl: '',
    gitRepository: '',
    environmentVars: {}
  })
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleDeploy = async () => {
    if (!generatedCode) return

    setIsDeploying(true)
    setDeploymentResult(null)

    try {
      // ここで実際のデプロイ処理を行う
      // 現在はダミー実装
      await new Promise(resolve => setTimeout(resolve, 3000)) // デモ用の待機時間

      // デモ用の成功レスポンス
      const mockResult = {
        success: true,
        url: `https://${deploymentConfig.projectName}.vercel.app`,
        error: undefined
      }

      // 実際の実装では onDeploy を使用
      const result = onDeploy ? await onDeploy(deploymentConfig) : mockResult
      
      setDeploymentResult(result)
    } catch (error) {
      setDeploymentResult({
        success: false,
        error: error instanceof Error ? error.message : 'デプロイに失敗しました'
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err)
    }
  }

  const isReadyToDeploy = generatedCode && deploymentConfig.projectName.trim().length > 0

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            <span>Vercelへデプロイ</span>
            <Badge variant="secondary" className="text-xs">
              準備中
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* デプロイ可能性チェック */}
          {!generatedCode ? (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                デプロイするにはまずコードを生成してください。
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>
                コードが生成されました。デプロイの準備が整いました。
              </AlertDescription>
            </Alert>
          )}

          {/* 基本設定 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">プロジェクト名</Label>
              <Input
                id="projectName"
                value={deploymentConfig.projectName}
                onChange={(e) => setDeploymentConfig(prev => ({
                  ...prev,
                  projectName: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                }))}
                placeholder="my-awesome-app"
                className="font-mono"
              />
              <p className="text-xs text-gray-600">
                デプロイ先URL: https://{deploymentConfig.projectName || 'your-project'}.vercel.app
              </p>
            </div>
          </div>

          {/* 高度な設定 */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>高度な設定</span>
              <motion.div
                animate={{ rotate: showAdvancedSettings ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="h-4 w-4" />
              </motion.div>
            </Button>

            <AnimatePresence>
              {showAdvancedSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL（オプション）</Label>
                    <Input
                      id="webhookUrl"
                      value={deploymentConfig.webhookUrl}
                      onChange={(e) => setDeploymentConfig(prev => ({
                        ...prev,
                        webhookUrl: e.target.value
                      }))}
                      placeholder="https://api.vercel.com/v1/deployments"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-600">
                      カスタムWebhook URLを指定できます。空白の場合はデフォルトを使用します。
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gitRepository">Gitリポジトリ（オプション）</Label>
                    <Input
                      id="gitRepository"
                      value={deploymentConfig.gitRepository}
                      onChange={(e) => setDeploymentConfig(prev => ({
                        ...prev,
                        gitRepository: e.target.value
                      }))}
                      placeholder="username/repository-name"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-600">
                      GitHubリポジトリと連携する場合に指定してください。
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* デプロイボタン */}
          <div className="space-y-4">
            <Button
              onClick={handleDeploy}
              disabled={!isReadyToDeploy || isDeploying}
              className="w-full bg-black hover:bg-gray-800 text-white py-3"
              size="lg"
            >
              {isDeploying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center space-x-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>デプロイ中...</span>
                </motion.div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5" />
                  <span>Vercelにデプロイ</span>
                </div>
              )}
            </Button>

            {/* プレビューボタン */}
            {generatedCode && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // ローカルプレビューを新しいタブで開く
                  const newWindow = window.open('', '_blank')
                  if (newWindow) {
                    newWindow.document.write(generatedCode.html)
                    newWindow.document.close()
                  }
                }}
              >
                <Globe className="h-4 w-4 mr-2" />
                ローカルプレビュー
              </Button>
            )}
          </div>

          {/* デプロイ結果 */}
          <AnimatePresence>
            {deploymentResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {deploymentResult.success ? (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-3">
                        <p className="font-semibold text-green-800">
                          🎉 デプロイが完了しました！
                        </p>
                        
                        {deploymentResult.url && (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={deploymentResult.url}
                              readOnly
                              className="font-mono text-sm bg-white"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyUrl(deploymentResult.url!)}
                              disabled={copiedUrl}
                            >
                              {copiedUrl ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(deploymentResult.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span>本番公開</span>
                          </Badge>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>HTTPS対応</span>
                          </Badge>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Github className="h-3 w-3" />
                            <span>Git連携</span>
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold text-red-800">
                          デプロイに失敗しました
                        </p>
                        <p className="text-red-700 text-sm">
                          {deploymentResult.error}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeploy}
                          className="mt-2"
                        >
                          再試行
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* デプロイ情報 */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Vercelの無料プランでは月100GBの帯域とサーバーレス関数実行時間の制限があります</p>
            <p>• デプロイされたアプリは世界中のCDNで配信され、高速にアクセスできます</p>
            <p>• カスタムドメインの設定やHTTPS証明書の自動発行に対応しています</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}