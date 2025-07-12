'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Coffee, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Calendar, 
  Users,
  Star,
  ChefHat,
  Wifi,
  ParkingCircle,
  Heart
} from 'lucide-react'

export default function CafeWebsite() {
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    people: '2',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const menuItems = [
    { id: 1, name: 'ブレンドコーヒー', description: '厳選された豆を使用した当店自慢のブレンド', price: '¥500', category: 'ドリンク' },
    { id: 2, name: 'カフェラテ', description: 'エスプレッソとミルクの絶妙なハーモニー', price: '¥600', category: 'ドリンク' },
    { id: 3, name: 'チーズケーキ', description: '濃厚でクリーミーな手作りチーズケーキ', price: '¥650', category: 'デザート' },
    { id: 4, name: 'クロワッサンサンド', description: 'サクサクのクロワッサンにハムとチーズ', price: '¥850', category: 'フード' },
    { id: 5, name: '季節のパスタ', description: '旬の食材を使用した日替わりパスタ', price: '¥1,200', category: 'フード' },
    { id: 6, name: '抹茶ティラミス', description: '和と洋の融合、大人のデザート', price: '¥700', category: 'デザート' }
  ]

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('予約情報:', reservationData)
    // ここで実際の予約処理を実装
    alert('予約を受け付けました。確認メールをお送りします。')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Coffee className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">Cafe Harmony</h1>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#menu" className="text-gray-600 hover:text-amber-600 transition-colors">メニュー</a>
              <a href="#access" className="text-gray-600 hover:text-amber-600 transition-colors">アクセス</a>
              <a href="#reservation" className="text-gray-600 hover:text-amber-600 transition-colors">予約</a>
              <a href="#news" className="text-gray-600 hover:text-amber-600 transition-colors">お知らせ</a>
            </div>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative h-[60vh] bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-800 mb-4"
          >
            心温まるひとときを
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            美味しいコーヒーと料理で、特別な時間をお届けします
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Calendar className="mr-2 h-5 w-5" />
              今すぐ予約
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: 'こだわりの料理', description: '地元の新鮮な食材を使用' },
              { icon: Wifi, title: 'Free Wi-Fi', description: '快適な作業環境をご提供' },
              { icon: ParkingCircle, title: '駐車場完備', description: '20台分の無料駐車場' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* メニューセクション */}
      <section id="menu" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">メニュー</h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="drink">ドリンク</TabsTrigger>
              <TabsTrigger value="food">フード</TabsTrigger>
              <TabsTrigger value="dessert">デザート</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* アクセスセクション */}
      <section id="access" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">店舗情報・アクセス</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>店舗情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <span>〒100-0001 東京都千代田区千代田1-1-1</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span>営業時間: 8:00 - 22:00（L.O. 21:30）</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span>TEL: 03-1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-600" />
                  <span>info@cafe-harmony.jp</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>アクセス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">地図を表示</span>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">・JR東京駅から徒歩5分</p>
                  <p className="text-sm text-gray-600">・地下鉄大手町駅から徒歩3分</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 予約フォームセクション */}
      <section id="reservation" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-12">ご予約</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>予約フォーム</CardTitle>
              <CardDescription>必要事項をご入力ください</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">日付</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      required
                      value={reservationData.date}
                      onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">時間</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      required
                      value={reservationData.time}
                      onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="people">人数</Label>
                  <Select 
                    value={reservationData.people}
                    onValueChange={(value) => setReservationData({...reservationData, people: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}名</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="name">お名前</Label>
                  <Input 
                    id="name" 
                    required
                    value={reservationData.name}
                    onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required
                      value={reservationData.email}
                      onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">電話番号</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      required
                      value={reservationData.phone}
                      onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">ご要望・メッセージ</Label>
                  <Textarea 
                    id="message"
                    value={reservationData.message}
                    onChange={(e) => setReservationData({...reservationData, message: e.target.value})}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  <Users className="mr-2 h-4 w-4" />
                  予約する
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Coffee className="h-6 w-6" />
              <span className="text-lg font-semibold">Cafe Harmony</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Cafe Harmony. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}