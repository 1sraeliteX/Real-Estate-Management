import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/lib/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Real Estate Admin Dashboard',
  description: 'Manage properties, tenants, maintenance, and payments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
