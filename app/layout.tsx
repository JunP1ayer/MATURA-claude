import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryProvider } from '@/components/providers/query-provider'
import { ToastProvider } from '@/components/ui/interactive-feedback'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MATURA - AIが伴走する創造の旅',
  description: '思いつきから収益化まで、対話だけで完走できるAI伴走体験。FreeTalkからReleaseまで、6つのフェーズであなたのアイデアを形にします。',
  keywords: ['AI', '開発支援', 'ノーコード', 'アプリ開発', 'MATURA'],
  authors: [{ name: 'MATURA Team' }],
  creator: 'MATURA',
  publisher: 'MATURA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MATURA - AIが伴走する創造の旅',
    description: '思いつきから収益化まで、対話だけで完走できるAI伴走体験',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATURA - AIが伴走する創造の旅',
    description: '思いつきから収益化まで、対話だけで完走できるAI伴走体験',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <ClientLayout>
                <div className="min-h-screen bg-gray-50">
                  {children}
                  <Toaster />
                </div>
              </ClientLayout>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}