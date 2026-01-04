import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '블록 퍼즐 게임',
  description: 'HTML5 기반 블록 맞추기 퍼즐 게임',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
