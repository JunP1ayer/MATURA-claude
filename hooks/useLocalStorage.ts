import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // SSR対応のためのstate初期化
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 値を更新する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 関数の場合は現在の値を渡して実行
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // ブラウザ環境でのみlocalStorageに保存
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // 他のタブでの変更を監視
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue] as const
}

// MATURA履歴専用フック
export function useMaturaHistory() {
  const [history, setHistory] = useLocalStorage<any[]>('MATURA_HISTORY', [])

  const addToHistory = (item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    setHistory((prev: any[]) => [newItem, ...prev].slice(0, 50)) // 最新50件まで保持
  }

  const clearHistory = () => {
    setHistory([])
  }

  const getHistoryByPhase = (phase: string) => {
    return history.filter((item: any) => item.phase === phase)
  }

  return {
    history,
    addToHistory,
    clearHistory,
    getHistoryByPhase,
  }
}