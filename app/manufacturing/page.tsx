'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Factory, Package, BarChart3, Settings, CheckCircle, Star, Users, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function ManufacturingPage() {
  const [selectedDemo, setSelectedDemo] = useState('inventory')

  const features = [
    {
      icon: Package,
      title: '在庫管理システム',
      description: '原材料から完成品まで、リアルタイムで在庫を追跡。自動発注機能付き。',
      benefits: ['在庫切れ防止', '保管コスト削減', '廃棄ロス削減']
    },
    {
      icon: Factory,
      title: '生産計画システム',
      description: '需要予測に基づく生産スケジュール最適化。設備稼働率向上。',
      benefits: ['納期短縮', '設備効率化', 'コスト削減']
    },
    {
      icon: BarChart3,
      title: '品質管理システム',
      description: '製品品質データの収集・分析。不良品率削減と品質向上。',
      benefits: ['品質向上', '不良率削減', 'トレーサビリティ']
    },
    {
      icon: Settings,
      title: '設備保全システム',
      description: '予防保全スケジュール管理。設備の故障予測とメンテナンス最適化。',
      benefits: ['稼働率向上', '故障予防', 'メンテ効率化']
    }
  ]

  const demos = {
    inventory: {
      title: '在庫管理システム',
      description: '部品番号、在庫数、発注点、仕入先情報を一元管理。',
      prompt: '製造業向けの在庫管理システムを作成してください。部品管理、在庫追跡、自動発注機能が必要です。'
    },
    production: {
      title: '生産計画システム',
      description: '製品別の生産計画、工程管理、進捗追跡を効率化。',
      prompt: '製造業向けの生産計画システムを作成してください。製品管理、工程管理、スケジュール管理が必要です。'
    },
    quality: {
      title: '品質管理システム',
      description: '品質検査データ、不良品管理、改善提案を統合管理。',
      prompt: '製造業向けの品質管理システムを作成してください。検査記録、不良品追跡、品質分析機能が必要です。'
    }
  }

  const testimonials = [
    {
      company: '○○製作所',
      industry: '精密機械製造',
      testimonial: 'MATURAで在庫管理システムを30分で構築。Excel管理から脱却でき、在庫の可視化が実現できました。',
      result: '在庫削減30%',
      person: '工場長 田中様'
    },
    {
      company: '△△工業',
      industry: '自動車部品製造',
      testimonial: '生産計画システムにより、設備稼働率が大幅に向上。納期遅延がほぼゼロになりました。',
      result: '稼働率15%向上',
      person: '生産管理部長 佐藤様'
    },
    {
      company: '□□電機',
      industry: '電子部品製造',
      testimonial: '品質管理システムで不良品率が半減。データに基づく改善活動が活発になりました。',
      result: '不良率50%削減',
      person: '品質保証部 山田様'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="compact" />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/80 hover:text-white transition-colors">
                機能
              </Link>
              <Link href="#demo" className="text-white/80 hover:text-white transition-colors">
                デモ
              </Link>
              <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                導入事例
              </Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/generator">
                今すぐ開始
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30">
            製造業特化
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            製造業の現場を
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              デジタル化
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            30分で在庫管理・生産計画・品質管理システムを構築。<br />
            Excel管理から脱却し、製造現場のDXを実現します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/generator">
                <Factory className="mr-2 h-5 w-5" />
                システム作成を開始
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              <Link href="#demo">
                デモを見る
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">30分</div>
              <div className="text-white/70">システム構築時間</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">30%</div>
              <div className="text-white/70">平均コスト削減</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-white/70">導入企業数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              製造業に特化した機能
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              現場の課題を解決する4つの核心システム
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/70 text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              実際にシステムを体験
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              30秒で完成するシステムの実力をご確認ください
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {Object.entries(demos).map(([key, demo]) => (
                <Button
                  key={key}
                  variant={selectedDemo === key ? "default" : "outline"}
                  className={`w-full justify-start text-left p-4 h-auto ${
                    selectedDemo === key 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedDemo(key)}
                >
                  <div>
                    <div className="font-semibold">{demo.title}</div>
                    <div className="text-sm opacity-80 mt-1">{demo.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="lg:col-span-2">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{demos[selectedDemo as keyof typeof demos].title}</CardTitle>
                  <CardDescription className="text-white/70">
                    以下のプロンプトでシステムを生成します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 rounded-lg p-4 mb-6">
                    <code className="text-green-400 text-sm">
                      &quot;{demos[selectedDemo as keyof typeof demos].prompt}&quot;
                    </code>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href={`/generator?prompt=${encodeURIComponent(demos[selectedDemo as keyof typeof demos].prompt)}`}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      このシステムを生成する
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              導入企業の声
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              MATURAで成功を収めた製造業の皆様
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                      {testimonial.result}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{testimonial.company}</CardTitle>
                  <CardDescription className="text-blue-300">{testimonial.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-white/80 mb-4">
                    &quot;{testimonial.testimonial}&quot;
                  </blockquote>
                  <div className="text-sm text-white/60">
                    — {testimonial.person}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            製造現場のDXを今すぐ開始
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            30分で完成する業務システム。まずは無料でお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/generator">
                <Factory className="mr-2 h-5 w-5" />
                無料でシステム作成を開始
              </Link>
            </Button>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                セキュア
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                30分で完成
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                サポート付き
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}