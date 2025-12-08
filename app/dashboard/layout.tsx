'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Search, User, ChevronRight, Settings } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import WelcomeGuide from '@/components/WelcomeGuide'
import HelpButton from '@/components/HelpButton'
import { ActivityProvider } from '@/lib/contexts/ActivityContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [appName, setAppName] = useState('Property Manager')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Load app name from localStorage
    const savedAppName = localStorage.getItem('appName')
    if (savedAppName) {
      setAppName(savedAppName)
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedAppName = localStorage.getItem('appName')
      if (updatedAppName) {
        setAppName(updatedAppName)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('appNameChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('appNameChanged', handleStorageChange)
    }
  }, [])

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard' }]
    
    let currentPath = ''
    paths.slice(1).forEach((segment) => {
      currentPath += `/${segment}`
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, path: `/dashboard${currentPath}` })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <ActivityProvider>
      <div className="flex min-h-screen bg-gray-50">
        <WelcomeGuide />
        <HelpButton />
      
      {/* Mobile overlay with backdrop blur */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        appName={appName}
      />
      
      <main className="flex-1 w-full lg:ml-0">
        {/* Enhanced Header - Mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <h1 className="text-lg font-bold text-gray-900">{appName}</h1>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      setShowUserMenu(false)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">New payment received</p>
                          <p className="text-xs text-gray-600 mt-1">John Doe paid ₦50,000</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">Maintenance request</p>
                          <p className="text-xs text-gray-600 mt-1">Room 101 - Plumbing issue</p>
                          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      setShowNotifications(false)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-600 mt-1">admin@property.com</p>
                      </div>
                      <button
                        onClick={() => {
                          router.push('/dashboard/profile')
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push('/dashboard/settings')
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => router.push('/')}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Breadcrumbs - Mobile */}
            <div className="flex items-center gap-1 text-sm overflow-x-auto pb-1">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-1 whitespace-nowrap">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <button
                    onClick={() => router.push(crumb.path)}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors`}
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Header - Desktop */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumbs - Desktop */}
              <div className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                      onClick={() => router.push(crumb.path)}
                      className={`${
                        index === breadcrumbs.length - 1
                          ? 'text-blue-600 font-semibold text-lg'
                          : 'text-gray-600 hover:text-gray-900'
                      } transition-colors`}
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties, tenants..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      setShowUserMenu(false)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">New payment received</p>
                          <p className="text-xs text-gray-600 mt-1">John Doe paid ₦50,000</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">Maintenance request</p>
                          <p className="text-xs text-gray-600 mt-1">Room 101 - Plumbing issue</p>
                          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      setShowNotifications(false)
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Admin</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-600 mt-1">admin@property.com</p>
                      </div>
                      <button
                        onClick={() => {
                          router.push('/dashboard/profile')
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push('/dashboard/settings')
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => router.push('/')}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
    </ActivityProvider>
  )
}
