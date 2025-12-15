'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Bell, Search, User, ChevronRight, Settings } from 'lucide-react'
import { ActivityProvider } from '@/lib/contexts/ActivityContext'

interface UserProfile {
  id: string
  name: string | null
  email: string
  avatar?: string | null
  phone?: string | null
  company?: string | null
  role?: string | null
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Set fallback profile data
    setUserProfile({
      id: 'fallback',
      name: 'Admin User',
      email: 'admin@property.com'
    })
    setIsLoadingProfile(false)
  }, [])

  return (
    <ActivityProvider>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 w-full">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ActivityProvider>
  )
}