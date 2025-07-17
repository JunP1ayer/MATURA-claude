import { Variants } from 'framer-motion'

// フェードイン系アニメーション
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
    },
  },
}

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
}

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
}

// スケール系アニメーション
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
}

export const scaleOnHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
}

// カード系アニメーション
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// リスト項目のアニメーション
export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

// ローディング系アニメーション
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const loadingDots: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// 進行状況バーのアニメーション
export const progressBar: Variants = {
  initial: {
    scaleX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
}

// モーダル・ダイアログのアニメーション
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
}

// 通知・トーストのアニメーション
export const toastSlideIn: Variants = {
  initial: {
    x: 300,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// 入力フィールドのフォーカスアニメーション
export const inputFocus: Variants = {
  initial: {
    borderColor: 'rgb(209, 213, 219)', // gray-300
  },
  focus: {
    borderColor: 'rgb(59, 130, 246)', // blue-500
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    transition: {
      duration: 0.2,
    },
  },
}

// ボタンの押下アニメーション
export const buttonPress: Variants = {
  initial: {
    scale: 1,
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

// データ読み込み時のスケルトンアニメーション
export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// 成功・エラー状態のアニメーション
export const successBounce: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export const errorShake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
}

// ナビゲーション系のアニメーション
export const slideUpMenu: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// カスタムイージング関数
export const customEasing = {
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.21, 1.02, 0.73, 1],
  swift: [0.4, 0, 0.2, 1],
  elastic: [0.175, 0.885, 0.32, 1.275],
}

// アニメーション設定のプリセット
export const animationPresets = {
  fast: { duration: 0.2 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
  veryFast: { duration: 0.1 },
  verySlow: { duration: 1.0 },
}

// ページ遷移のアニメーション
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: customEasing.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
}

// 共通のアニメーション設定
export const commonTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
}

export default {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleOnHover,
  cardHover,
  listItemVariants,
  staggerContainer,
  loadingSpinner,
  loadingDots,
  progressBar,
  modalBackdrop,
  modalContent,
  toastSlideIn,
  inputFocus,
  buttonPress,
  skeletonPulse,
  successBounce,
  errorShake,
  slideUpMenu,
  pageTransition,
  customEasing,
  animationPresets,
  commonTransition,
}