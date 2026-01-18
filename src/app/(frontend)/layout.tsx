// src/app/(frontend)/layout.tsx
import type { ReactNode } from 'react'
import { Header, Footer } from '@/components/layout'
import './global.css'

export const metadata = {
  title: '云深亦知梦',
  description: '记录技术探索与生活感悟',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
