import { useState, useRef, useCallback } from 'react'

interface SwipeState {
  x: number
  y: number
  isDragging: boolean
  startX: number
  startY: number
}

interface UseSwipeGestureOptions {
  threshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipeGesture(options: UseSwipeGestureOptions = {}) {
  const {
    threshold = 100,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options

  const [swipeState, setSwipeState] = useState<SwipeState>({
    x: 0,
    y: 0,
    isDragging: false,
    startX: 0,
    startY: 0
  })

  const elementRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setSwipeState({
      x: 0,
      y: 0,
      isDragging: true,
      startX: clientX,
      startY: clientY
    })
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!swipeState.isDragging) return

    const deltaX = clientX - swipeState.startX
    const deltaY = clientY - swipeState.startY

    setSwipeState(prev => ({
      ...prev,
      x: deltaX,
      y: deltaY
    }))
  }, [swipeState.isDragging, swipeState.startX, swipeState.startY])

  const handleEnd = useCallback(() => {
    if (!swipeState.isDragging) return

    const { x, y } = swipeState
    const absX = Math.abs(x)
    const absY = Math.abs(y)

    // Determine swipe direction
    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (x > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (x < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (y > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (y < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    // Reset state
    setSwipeState({
      x: 0,
      y: 0,
      isDragging: false,
      startX: 0,
      startY: 0
    })
  }, [swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleEnd()
  }, [handleEnd])

  const onMouseLeave = useCallback(() => {
    if (swipeState.isDragging) {
      handleEnd()
    }
  }, [swipeState.isDragging, handleEnd])

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [handleMove])

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const handlers = {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }

  return {
    ref: elementRef,
    handlers,
    swipeState,
    transform: `translate(${swipeState.x}px, ${swipeState.y}px) rotate(${swipeState.x * 0.1}deg)`,
    opacity: 1 - Math.abs(swipeState.x) / 500
  }
}