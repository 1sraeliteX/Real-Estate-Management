'use client'


import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { DollarSign, Settings, LayoutDashboard, ChevronLeft, ChevronRight, Users, CreditCard, Home, User } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'

const menuItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard, description: 'Overview' },
  { name: 'My Properties', href: '/dashboard/properties', icon: Home, description: 'Houses & Rooms' },
  { name: 'Occupants', href: '/dashboard/occupants', icon: Users, description: 'Manage Tenants' },
  { name: 'Money', href: '/dashboard/finances', icon: DollarSign, description: 'Payments & Income' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'App Settings' },
  { name: 'Project Pricing', href: '/dashboard/pricing', icon: CreditCard, description: 'View Plans' },
]

interface UserProfile {
  id: string
  name: string | null
  email: string
  avatar?: string | null
  phone?: string | null
  company?: string | null
  role?: string | null
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
  appName?: string
  userProfile?: UserProfile | null
  isLoadingProfile?: boolean
}

export default function Sidebar({ 
  isCollapsed, 
  onToggle, 
  isMobileOpen, 
  onMobileClose, 
  appName: propAppName, 
  userProfile, 
  isLoadingProfile 
}: SidebarProps) {
  const pathname = usePathname()
  const appName = propAppName || 'Property Manager'

  const handleLinkClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <aside 
      className={`bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col overflow-y-auto ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isMobileOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:z-40'
      }`}
    >
      <div className="p-6 flex-1 flex flex-col">
      {/* Close Button - Mobile only */}
      {isMobileOpen && (
        <div className="lg:hidden mb-4">
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors ml-auto block"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Toggle Button - Desktop only */}
      <button
        onClick={onToggle}
        className="hidden lg:block absolute -right-3 top-8 bg-gray-900 border-2 border-gray-700 rounded-full p-1 hover:bg-gray-800 transition-colors z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Logo/Title */}
      <div className="mb-8">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Image 
              src="/corner3.png" 
              alt="Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <Image 
              src="/corner3.png" 
              alt="CornerStone Realty App" 
              width={400} 
              height={120} 
              className="object-contain"
            />
          </div>
        )}
      </div>
      
        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? `${item.name} - ${item.description}` : ''}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Profile Section - Separated with spacing */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <Link
            href="/dashboard/profile"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-all ${
              pathname === '/dashboard/profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Profile' : ''}
          >
            {isLoadingProfile ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <User className="w-5 h-5" />
              </div>
            ) : userProfile?.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            {!isCollapsed && (
              <span className="font-semibold text-base">Profile</span>
            )}
          </Link>
          
          {/* Dark Mode Toggle */}
          {!isCollapsed && (
            <div className="mt-4 px-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Theme</span>
                <DarkModeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
