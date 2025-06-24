'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DesignProposal, 
  DesignGeneratorResponse,
  generateDesignPrompt,
  generateSampleDesigns 
} from '@/lib/prompts/design-generator'
import { cn } from '@/lib/utils'
import { CheckCircle, Play, ArrowRight, Star, Zap, Heart, Shield, User, Search, Sparkles, Brain, Menu, Home } from 'lucide-react'

interface UIStyleSelectorProps {
  userIdea: string
  onDesignSelected: (design: DesignProposal) => void
  className?: string
  isSelectionComplete?: boolean
}

// 5つの固定スタイル定義
const DESIGN_STYLES = [
  {
    id: 'clean-workspace',
    name: 'Clean Workspace',
    description: 'Clean, AI-powered workspace'
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Minimal, sophisticated design'
  },
  {
    id: 'saas-professional',
    name: 'SaaS Professional',
    description: 'Enterprise-grade interface'
  },
  {
    id: 'dark-focus',
    name: 'Dark Focus',
    description: 'Dark, focused productivity'
  },
  {
    id: 'friendly-community',
    name: 'Friendly Community',
    description: 'Warm, human-centered design'
  }
]

export const UIStyleSelector: React.FC<UIStyleSelectorProps> = ({
  userIdea,
  onDesignSelected,
  className,
  isSelectionComplete = false
}) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const handleSelectStyle = (styleId: string) => {
    setSelectedStyleId(styleId)
    
    const selectedStyle = DESIGN_STYLES.find(s => s.id === styleId)
    if (selectedStyle) {
      const dummyDesign: DesignProposal = {
        id: styleId,
        heading: `${selectedStyle.name} for ${userIdea}`,
        subDescription: selectedStyle.description,
        styleName: selectedStyle.name,
        colorScheme: { primary: '#3b82f6', secondary: '#8b5cf6', background: '#ffffff' },
        tags: ['Modern', 'Professional'],
        targetAudience: 'Professional users',
        uniqueValue: `${selectedStyle.name} aesthetic`,
        productAnalysis: {
          why: 'Modern design needs',
          who: 'Target users',
          what: 'Design solution',
          how: 'Implementation approach',
          impact: 'Expected results'
        }
      }
      onDesignSelected(dummyDesign)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto" />
          <div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">デザインスタイルを準備中</p>
            <p className="text-gray-500">最適な5つのスタイルを生成しています</p>
          </div>
        </div>
      </div>
    )
  }

  if (isSelectionComplete) {
    return null
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          ✨ デザインスタイルを選択 ✨
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          あなたのプロダクトにふさわしいUIの世界観を選んでください
        </p>
      </div>

      {/* Design Style Cards - 実際のWebアプリのトップページのような完成度 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* 1. Clean Workspace Style - クリーンなワークスペース */}
        <Card 
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 h-[500px]",
            "hover:shadow-xl hover:-translate-y-1",
            selectedStyleId === 'clean-workspace' 
              ? "ring-4 ring-blue-300/50 shadow-xl -translate-y-1 border-blue-300" 
              : "border-gray-200 hover:border-blue-200"
          )}
          onClick={() => handleSelectStyle('clean-workspace')}
        >
          <div className="h-full bg-white flex flex-col">
            {/* Clean Header */}
            <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-black rounded text-white flex items-center justify-center text-xs font-bold">W</div>
                <span className="text-sm font-medium text-gray-700">Workspace</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Menu className="w-4 h-4 text-gray-400" />
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="flex-1 p-8 flex flex-col justify-center text-center">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Write, plan, share.<br />
                  <span className="text-blue-600">With AI.</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  The connected workspace where<br />
                  better, faster work happens.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg font-medium">
                  Try it free
                </Button>
              </div>
            </div>
            
            {/* Bottom Features */}
            <div className="px-8 pb-6">
              <div className="flex justify-center gap-6">
                {['AI', 'Docs', 'Wiki'].map((feature, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    </div>
                    <span className="text-xs text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {selectedStyleId === 'clean-workspace' && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        {/* 2. Minimal Elegance Style - ミニマル洗練 */}
        <Card 
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 h-[500px]",
            "hover:shadow-xl hover:-translate-y-1",
            selectedStyleId === 'minimal-elegance' 
              ? "ring-4 ring-gray-300/50 shadow-xl -translate-y-1 border-gray-300" 
              : "border-gray-200 hover:border-gray-300"
          )}
          onClick={() => handleSelectStyle('minimal-elegance')}
        >
          <div className="h-full bg-white flex flex-col">
            {/* Minimal Header */}
            <div className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center px-8 flex-shrink-0">
              <div className="w-6 h-6 bg-black rounded-full mr-8"></div>
              <nav className="flex gap-8 text-sm text-gray-700">
                <span>Products</span>
                <span>Solutions</span>
                <span>About</span>
              </nav>
              <div className="ml-auto">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Support
                </Button>
              </div>
            </div>
            
            {/* Split Hero Layout */}
            <div className="flex-1 flex">
              {/* Left Content */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Supercharged<br />
                  for pros.
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  The most powerful laptop ever<br />
                  is here. Supercharged by advanced<br />
                  processing technology.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Learn more
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-600">
                    Get started
                  </Button>
                </div>
              </div>
              
              {/* Right Visual */}
              <div className="flex-1 p-8 flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl relative">
                  <div className="absolute inset-4 bg-black rounded-xl"></div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {selectedStyleId === 'minimal-elegance' && (
            <div className="absolute top-4 right-4">
              <div className="bg-gray-800 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        {/* 3. SaaS Professional Style - エンタープライズ */}
        <Card 
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 h-[500px]",
            "hover:shadow-xl hover:-translate-y-1",
            selectedStyleId === 'saas-professional' 
              ? "ring-4 ring-blue-300/50 shadow-xl -translate-y-1 border-blue-300" 
              : "border-gray-200 hover:border-blue-200"
          )}
          onClick={() => handleSelectStyle('saas-professional')}
        >
          <div className="h-full bg-slate-900 text-white flex flex-col">
            {/* SaaS Header */}
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-white">SecureApp</span>
              </div>
              <nav className="ml-8 flex gap-6 text-sm text-slate-300">
                <span>Solutions</span>
                <span>Pricing</span>
                <span>Docs</span>
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm text-slate-400">Login</span>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start free trial
                </Button>
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="flex-1 p-8 flex flex-col justify-center text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                  Enterprise Security<br />
                  <span className="text-blue-400">Made Simple</span>
                </h1>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Protect your business with bank-level security.<br />
                  Trusted by 10,000+ companies worldwide.
                </p>
                <div className="flex justify-center gap-4 mb-8">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    Start 14-day trial
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Schedule demo
                  </Button>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SOC 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>GDPR</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
          
          {selectedStyleId === 'saas-professional' && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        {/* 4. Dark Focus Style - ダーク＆ミニマル */}
        <Card 
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 h-[500px]",
            "hover:shadow-xl hover:-translate-y-1",
            selectedStyleId === 'dark-focus' 
              ? "ring-4 ring-purple-300/50 shadow-xl -translate-y-1 border-purple-300" 
              : "border-gray-800 hover:border-purple-400"
          )}
          onClick={() => handleSelectStyle('dark-focus')}
        >
          <div className="h-full bg-black text-white flex flex-col">
            {/* Minimal Header */}
            <div className="h-14 bg-black border-b border-gray-800 flex items-center px-6 flex-shrink-0">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
              <div className="ml-auto flex gap-6 text-sm text-gray-400">
                <span className="hover:text-white transition-colors">Features</span>
                <span className="hover:text-white transition-colors">Pricing</span>
              </div>
            </div>
            
            {/* Typography-focused Hero */}
            <div className="flex-1 p-8 flex flex-col justify-center text-center">
              <div className="mb-12">
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                  ProFlow
                </h1>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">
                  The fastest workflow experience ever made
                </h2>
                <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                  Fly through your tasks like never before.<br />
                  Built for teams that move fast.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 text-lg rounded-lg">
                  Get started
                </Button>
              </div>
            </div>
            
            {/* Bottom Icons */}
            <div className="px-8 pb-6">
              <div className="flex justify-center gap-6">
                {[Zap, Search, Star].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {selectedStyleId === 'dark-focus' && (
            <div className="absolute top-4 right-4">
              <div className="bg-purple-500 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        {/* 5. Friendly Community Style - 温かい・人間らしい */}
        <Card 
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 h-[500px]",
            "hover:shadow-xl hover:-translate-y-1",
            selectedStyleId === 'friendly-community' 
              ? "ring-4 ring-rose-300/50 shadow-xl -translate-y-1 border-rose-300" 
              : "border-gray-200 hover:border-rose-200"
          )}
          onClick={() => handleSelectStyle('friendly-community')}
        >
          <div className="h-full bg-gradient-to-b from-rose-50 to-white flex flex-col">
            {/* Friendly Header */}
            <div className="h-16 bg-white border-b border-rose-100 flex items-center px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-500" />
                <span className="font-semibold text-gray-800">connect</span>
              </div>
              <nav className="ml-8 flex gap-6 text-sm text-gray-700">
                <span>Discover</span>
                <span>Experiences</span>
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm text-gray-600">Join community</span>
                <div className="w-8 h-8 bg-rose-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Search-focused Hero */}
            <div className="flex-1 p-8 flex flex-col justify-center text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Find your community
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Discover amazing places and experiences from our community...
                </p>
                
                {/* Search Bar */}
                <div className="max-w-lg mx-auto mb-8">
                  <div className="bg-white rounded-full border-2 border-gray-200 shadow-lg p-4 flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400 flex-1 text-left">Where are you going?</span>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Category Icons */}
              <div className="flex justify-center gap-8">
                {[
                  { icon: Home, label: 'Unique stays', color: 'bg-rose-100 text-rose-600' },
                  { icon: Star, label: 'Top rated', color: 'bg-amber-100 text-amber-600' },
                  { icon: Heart, label: 'Wishlist', color: 'bg-pink-100 text-pink-600' }
                ].map(({ icon: Icon, label, color }, i) => (
                  <div key={i} className="text-center">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-3", color)}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {selectedStyleId === 'friendly-community' && (
            <div className="absolute top-4 right-4">
              <div className="bg-rose-500 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

      </div>

      {/* Selection Confirmation */}
      {selectedStyleId && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              「{DESIGN_STYLES.find(s => s.id === selectedStyleId)?.name}」を選択しました
            </span>
          </div>
        </div>
      )}
    </div>
  )
}