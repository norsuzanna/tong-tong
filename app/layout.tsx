import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tong-Tong - Split Bills Malaysian Style',
  description: 'Easy bill splitting for dine-in and delivery with Malaysian tax calculations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}