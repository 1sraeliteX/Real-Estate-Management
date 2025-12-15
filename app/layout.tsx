import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/lib/providers/QueryProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'CornerStone Realty App',
  description: 'Manage properties, tenants, maintenance, and payments',
  keywords: 'property management, real estate, tenants, maintenance, payments',
  authors: [{ name: 'CornerStone Realty' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
