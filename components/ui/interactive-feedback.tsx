'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  toastSlideIn, 
  successBounce, 
  errorShake, 
  scaleIn, 
  loadingSpinner 
} from '@/lib/animations'

// トーストタイプ
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// トーストマネージャーのコンテキスト
interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// トーストプロバイダー
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // 自動削除（persistentでない場合）
    if (!toast.persistent && toast.type !== 'loading') {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// トーストコンテナ
function ToastContainer() {
  const context = React.useContext(ToastContext)
  if (!context) return null

  const { toasts, removeToast } = context

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// 個別のトーストアイテム
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'loading':
        return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBackground = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'loading':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <motion.div
      variants={toastSlideIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'min-w-80 max-w-md p-4 rounded-lg shadow-lg border',
        getBackground()
      )}
    >
      <div className="flex items-start gap-3">
        <motion.div
          variants={toast.type === 'success' ? successBounce : toast.type === 'error' ? errorShake : scaleIn}
          animate="animate"
        >
          {getIcon()}
        </motion.div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-gray-700 text-sm mt-1">
              {toast.message}
            </p>
          )}
        </div>

        {!toast.persistent && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// トーストフック
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { addToast, removeToast } = context

  return {
    toast: {
      success: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'success', title, message, ...options }),
      
      error: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'error', title, message, ...options }),
      
      info: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'info', title, message, ...options }),
      
      warning: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'warning', title, message, ...options }),
      
      loading: (title: string, message?: string) =>
        addToast({ type: 'loading', title, message, persistent: true }),
      
      dismiss: removeToast,
    }
  }
}

// インタラクティブボタンコンポーネント
interface InteractiveButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function InteractiveButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = '処理中...',
  children,
  className,
  disabled,
  ...props
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-500'
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      disabled={disabled || isLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isPressed ? 0.98 : 1,
      }}
      transition={{
        duration: 0.1,
        ease: 'easeInOut',
      }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// インタラクティブカードコンポーネント
interface InteractiveCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  hover?: boolean
  clickable?: boolean
  children: React.ReactNode
}

export function InteractiveCard({
  hover = true,
  clickable = false,
  children,
  className,
  ...props
}: InteractiveCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-lg border bg-white p-6 shadow-sm',
        clickable && 'cursor-pointer',
        className
      )}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// プログレスバーコンポーネント
interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'red' | 'yellow'
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'blue',
  showPercentage = false,
  animated = true,
}: ProgressBarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1'
      case 'md':
        return 'h-2'
      case 'lg':
        return 'h-3'
      default:
        return 'h-2'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500'
      case 'green':
        return 'bg-green-500'
      case 'red':
        return 'bg-red-500'
      case 'yellow':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">進捗</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', getSizeClasses())}>
        <motion.div
          className={cn('h-full rounded-full', getColorClasses())}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  )
}

// 操作フィードバック用のリップルエフェクト
export function RippleEffect({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 pointer-events-none"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}