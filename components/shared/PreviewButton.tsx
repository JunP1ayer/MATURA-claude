'use client'

import { useState } from 'react'
import { Eye, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PreviewButtonProps {
  data: any
  title?: string
  className?: string
}

export default function PreviewButton({ data, title = '構造化データ', className }: PreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!data) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors',
          className
        )}
      >
        <Eye className="w-4 h-4" />
        プレビュー
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-matura-dark">
                  {title}プレビュー
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
                {typeof data === 'object' ? (
                  <div className="space-y-4">
                    {/* 美しい構造化データ表示 */}
                    {Object.entries(data).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-matura-primary capitalize mb-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="text-gray-700">
                          {Array.isArray(value) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {value.map((item, index) => (
                                <li key={index}>{String(item)}</li>
                              ))}
                            </ul>
                          ) : typeof value === 'object' && value !== null ? (
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            <p>{String(value)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                    {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
                  </pre>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}