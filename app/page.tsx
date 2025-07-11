'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Rocket, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-purple-500" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              MATURA
            </h1>
          </div>
          
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            自然言語でアプリを作ろう
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            あなたのアイデアを、そのまま文章で書くだけ。
            <br />
            MATURAが自動で動くアプリに変換します。
          </p>

          <div className="flex justify-center">
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 text-lg">
                <Rocket className="mr-2 h-6 w-6" />
                今すぐアプリを作る
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            なぜMATURAを選ぶのか？
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>超簡単</CardTitle>
                <CardDescription>
                  プログラミング知識は不要。普通の言葉で話すだけ。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>瞬間生成</CardTitle>
                <CardDescription>
                  数分で完全に動作するアプリが完成します。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>本格的</CardTitle>
                <CardDescription>
                  おもちゃではありません。実用的なアプリを生成。
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* 使用例セクション */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            こんなアプリが作れます
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "タスク管理アプリ",
                description: "毎日のやることリストを効率的に管理",
                example: "「毎日のタスクを管理できるアプリを作って」",
                icon: "📝"
              },
              {
                title: "家計簿アプリ",
                description: "収入と支出をカテゴリ別に記録・分析",
                example: "「収支を記録してグラフで見れる家計簿が欲しい」",
                icon: "💰"
              },
              {
                title: "ブログサイト",
                description: "記事を投稿・管理できるWebサイト",
                example: "「記事を書いて投稿できるブログを作りたい」",
                icon: "📖"
              },
              {
                title: "在庫管理アプリ",
                description: "商品の在庫を追跡・管理",
                example: "「商品の在庫数を管理できるシステム」",
                icon: "📦"
              },
              {
                title: "予約システム",
                description: "予約の受付と管理ができるアプリ",
                example: "「お客様の予約を管理できるアプリ」",
                icon: "📅"
              },
              {
                title: "学習管理アプリ",
                description: "学習進捗を記録・可視化",
                example: "「勉強時間と進捗を記録するアプリ」",
                icon: "📚"
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm italic text-gray-700">
                      "{item.example}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA セクション */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            あなたのアイデアを形にしませんか？
          </h3>
          <p className="text-xl mb-8 opacity-90">
            たった数分で、あなただけのアプリが完成します
          </p>
          
          <Link href="/generator">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-4 px-8 text-lg">
              <Sparkles className="mr-2 h-6 w-6" />
              無料で始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}