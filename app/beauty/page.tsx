'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Scissors, Calendar, Users, BarChart3, CheckCircle, Star, Clock, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function BeautyPage() {
  const [selectedDemo, setSelectedDemo] = useState('reservation')

  const features = [
    {
      icon: Calendar,
      title: '予約管理システム',
      description: 'オンライン予約、キャンセル待ち、リマインダー機能でお客様と店舗の両方が便利に。',
      benefits: ['24時間予約受付', '予約率向上', '無断キャンセル削減']
    },
    {
      icon: Users,
      title: '顧客管理システム',
      description: '来店履歴、施術記録、お客様の好みまで一元管理。リピート率向上に直結。',
      benefits: ['リピート率向上', 'パーソナライズ', '顧客満足度UP']
    },
    {
      icon: Scissors,
      title: 'スタッフ管理システム',
      description: 'シフト管理、技術レベル、売上実績を可視化。適材適所の配置が可能。',
      benefits: ['効率的シフト', '技術向上支援', '売上最大化']
    },
    {
      icon: BarChart3,
      title: '売上分析システム',
      description: '日別・月別売上、人気メニュー、顧客動向を分析。経営判断をデータで支援。',
      benefits: ['売上向上', 'メニュー最適化', 'データ経営']
    }
  ]

  const demos = {
    reservation: {
      title: '予約管理システム',
      description: 'オンライン予約、空き時間確認、スタッフ指名機能。',
      prompt: '美容院向けの予約管理システムを作成してください。オンライン予約、スタッフ指名、時間管理機能が必要です。'
    },
    customer: {
      title: '顧客管理システム',
      description: '来店履歴、施術記録、お客様情報の一元管理。',
      prompt: '美容院向けの顧客管理システムを作成してください。顧客情報、来店履歴、施術記録管理が必要です。'
    },
    staff: {
      title: 'スタッフ管理システム',
      description: 'シフト管理、売上実績、技術レベル追跡。',
      prompt: '美容院向けのスタッフ管理システムを作成してください。シフト管理、売上管理、技術評価機能が必要です。'
    }
  }

  const testimonials = [
    {
      company: 'Hair Salon AKIRA',
      location: '東京・表参道',
      testimonial: 'MATURAの予約システムで無断キャンセルが半減。お客様からも「予約が簡単」と好評です。',
      result: '予約率30%向上',
      person: 'オーナー 木村様'
    },
    {
      company: 'Beauty Studio Kira',
      location: '大阪・梅田',
      testimonial: '顧客管理システムでリピート率が大幅アップ。お客様一人ひとりに合った提案ができるようになりました。',
      result: 'リピート率40%向上',
      person: '店長 田中様'
    },
    {
      company: 'Hair&Make Salon Rose',
      location: '名古屋・栄',
      testimonial: 'スタッフのシフト管理が楽になり、売上も見える化。スタッフのモチベーションも向上しました。',
      result: '売上20%向上',
      person: 'マネージャー 佐藤様'
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: '営業時間外も予約受付',
      description: '24時間いつでもお客様が予約可能'
    },
    {
      icon: Smartphone,
      title: 'スマホ完全対応',
      description: 'お客様もスタッフも外出先から操作'
    },
    {
      icon: Users,
      title: 'お客様満足度向上',
      description: 'パーソナライズされたサービス提供'
    },
    {
      icon: BarChart3,
      title: 'データ分析で売上UP',
      description: '客観的なデータに基づく経営判断'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900">
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
            <Button asChild className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
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
          <Badge className="mb-6 bg-pink-600/20 text-pink-300 border-pink-600/30">
            美容院・サロン特化
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            美容院経営を
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              スマート化
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            30分で予約管理・顧客管理・スタッフ管理システムを構築。<br />
            お客様満足度向上と売上アップを同時に実現します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/generator">
                <Scissors className="mr-2 h-5 w-5" />
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
              <div className="text-3xl font-bold text-pink-400 mb-2">30分</div>
              <div className="text-white/70">システム構築時間</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
              <div className="text-white/70">平均リピート率向上</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">200+</div>
              <div className="text-white/70">導入サロン数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              なぜ美容院にデジタル化が必要？
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              お客様の期待値上昇と競争激化に対応するために
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="mx-auto p-4 bg-pink-600/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <benefit.icon className="h-8 w-8 text-pink-400" />
                  </div>
                  <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{benefit.description}</p>
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
              美容院に特化した機能
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              サロン運営に必要な機能がすべて揃っています
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-pink-600/20 rounded-lg">
                      <feature.icon className="h-6 w-6 text-pink-400" />
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
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white" 
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
                  <Button asChild className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
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
              導入サロンの声
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              MATURAで成功を収めた美容院の皆様
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
                  <CardDescription className="text-pink-300">{testimonial.location}</CardDescription>
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
            美容院経営をデジタル化して差をつけませんか？
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            30分で完成する業務システム。まずは無料でお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/generator">
                <Scissors className="mr-2 h-5 w-5" />
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