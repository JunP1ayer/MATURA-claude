'use client'

import { MessageCircle, Lightbulb, Palette, Wrench, Code2, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhaseIndicatorProps {
  currentPhase: number
  className?: string
}

const phases = [
  { 
    name: 'FreeTalk', 
    title: '自由対話', 
    icon: MessageCircle,
    color: 'text-blue-500'
  },
  { 
    name: 'InsightRefine', 
    title: '洞察精製', 
    icon: Lightbulb,
    color: 'text-yellow-500'
  },
  { 
    name: 'SketchView', 
    title: 'UI選択', 
    icon: Palette,
    color: 'text-purple-500'
  },
  { 
    name: 'UXBuild', 
    title: 'UX構築', 
    icon: Wrench,
    color: 'text-green-500'
  },
  { 
    name: 'CodePlayground', 
    title: 'コード生成', 
    icon: Code2,
    color: 'text-orange-500'
  },
  { 
    name: 'ReleaseBoard', 
    title: 'リリース', 
    icon: Rocket,
    color: 'text-red-500'
  },
]

export default function PhaseIndicator({ currentPhase, className }: PhaseIndicatorProps) {
  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* デスクトップ版 */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {phases.map((phase, index) => {
          const Icon = phase.icon
          const isActive = index === currentPhase
          const isCompleted = index < currentPhase
          const isUpcoming = index > currentPhase

          return (
            <div key={phase.name} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    {
                      'bg-matura-primary border-matura-primary text-white': isActive || isCompleted,
                      'bg-gray-100 border-gray-300 text-gray-400': isUpcoming,
                    }
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium transition-colors duration-300',
                    {
                      'text-matura-primary': isActive || isCompleted,
                      'text-gray-400': isUpcoming,
                    }
                  )}
                >
                  {phase.title}
                </span>
              </div>
              
              {/* 接続線 */}
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors duration-300',
                    {
                      'bg-matura-primary': index < currentPhase,
                      'bg-gray-300': index >= currentPhase,
                    }
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* モバイル版 */}
      <div className="md:hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-sm text-gray-500">
                {currentPhase + 1} / {phases.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {(() => {
                const Icon = phases[currentPhase].icon
                return <Icon className={cn('w-6 h-6', phases[currentPhase].color)} />
              })()}
              <h3 className="text-lg font-semibold text-matura-dark">
                {phases[currentPhase].title}
              </h3>
            </div>
          </div>
        </div>
        
        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-matura-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}