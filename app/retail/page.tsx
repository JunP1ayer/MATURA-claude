'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ShoppingCart, Package, Users, TrendingUp, CheckCircle, Star, Clock, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function RetailPage() {
  const [selectedDemo, setSelectedDemo] = useState('pos')

  const features = [
    {
      icon: ShoppingCart,
      title: 'POSシステム',
      description: 'レジ業務、在庫連動、売上記録を一元化。スムーズな会計とリアルタイム売上分析。',
      benefits: ['会計時間短縮', '売上リアルタイム', 'レジ締め効率化']
    },
    {
      icon: Package,
      title: '在庫管理システム',
      description: '商品の入荷・出荷・在庫数をリアルタイム管理。品切れ防止と過剰在庫削減。',
      benefits: ['品切れ防止', '在庫最適化', '発注自動化']
    },
    {
      icon: Users,
      title: '顧客管理システム',
      description: '購入履歴、ポイント管理、顧客の嗜好分析でリピート購入を促進。',
      benefits: ['リピート率向上', 'ポイント管理', '顧客分析']
    },
    {
      icon: TrendingUp,
      title: '売上分析システム',
      description: '商品別・時間別・期間別の売上分析。データに基づく経営判断をサポート。',
      benefits: ['売上向上', 'トレンド把握', 'データ経営']
    }
  ]

  const demos = {
    pos: {
      title: 'POSシステム',
      description: 'バーコード読取、会計処理、レシート発行機能。',
      prompt: '小売店向けのPOSシステムを作成してください。商品管理、会計処理、売上記録機能が必要です。'
    },
    inventory: {
      title: '在庫管理システム',
      description: '商品入荷、在庫追跡、発注管理の統合システム。',
      prompt: '小売店向けの在庫管理システムを作成してください。商品管理、在庫追跡、発注管理機能が必要です。'
    },
    customer: {
      title: '顧客管理システム',
      description: '会員情報、購入履歴、ポイント管理システム。',
      prompt: '小売店向けの顧客管理システムを作成してください。会員管理、購入履歴、ポイント管理機能が必要です。'
    }
  }

  const testimonials = [
    {
      company: '○○商店',
      type: '食品スーパー',
      testimonial: 'POSシステムで会計がスムーズになり、お客様の待ち時間が大幅短縮。売上分析で仕入れも最適化できました。',
      result: '売上15%向上',
      person: '店長 鈴木様'
    },
    {
      company: 'Fashion Store △△',
      type: 'アパレル',
      testimonial: '在庫管理システムで品切れがほぼゼロに。顧客管理でリピート率も向上し、売上が安定しました。',
      result: 'リピート率25%向上',
      person: 'オーナー 田中様'
    },
    {
      company: '書店□□',
      type: '書店',
      testimonial: '顧客の購入傾向が分析できるようになり、おすすめ商品の提案精度が大幅アップしました。',
      result: '客単価20%向上',
      person: '店主 佐藤様'
    }
  ]

  const storeTypes = [
    {
      icon: ShoppingCart,
      title: 'スーパーマーケット',
      description: '食品・日用品の大量販売に最適なPOS・在庫システム'
    },
    {
      icon: Package,
      title: 'コンビニエンスストア',
      description: '24時間営業に対応した効率的な店舗運営システム'
    },
    {
      icon: Users,
      title: 'アパレルショップ',
      description: 'サイズ・色別在庫管理と顧客嗜好分析システム'
    },
    {
      icon: TrendingUp,
      title: '専門店',
      description: '書店・薬局・雑貨店など専門性を活かした分析システム'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
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
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
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
          <Badge className="mb-6 bg-emerald-600/20 text-emerald-300 border-emerald-600/30">
            小売業・店舗特化
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            店舗運営を
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              効率化
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            30分でPOS・在庫管理・顧客管理システムを構築。<br />
            売上向上と業務効率化を同時に実現します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6">
              <Link href="/generator">
                <ShoppingCart className="mr-2 h-5 w-5" />
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
              <div className="text-3xl font-bold text-emerald-400 mb-2">30分</div>
              <div className="text-white/70">システム構築時間</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">25%</div>
              <div className="text-white/70">平均売上向上</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">300+</div>
              <div className="text-white/70">導入店舗数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Types Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              あらゆる小売業に対応
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              業種に合わせたカスタマイズで最適なシステムを提供
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeTypes.map((store, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="mx-auto p-4 bg-emerald-600/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <store.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <CardTitle className="text-white text-lg">{store.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{store.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              小売業に特化した機能
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              店舗運営に必要な機能がすべて揃っています
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-emerald-600/20 rounded-lg">
                      <feature.icon className="h-6 w-6 text-emerald-400" />
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
      <section id="demo" className="py-20 px-4 bg-black/20">
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
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" 
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
                  <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
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
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              導入店舗の声
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              MATURAで成功を収めた小売店の皆様
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
                  <CardDescription className="text-emerald-300">{testimonial.type}</CardDescription>
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
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            店舗運営をデジタル化で効率化しませんか？
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            30分で完成する業務システム。まずは無料でお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6">
              <Link href="/generator">
                <ShoppingCart className="mr-2 h-5 w-5" />
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
                <Smartphone className="h-4 w-4" />
                スマホ対応
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}