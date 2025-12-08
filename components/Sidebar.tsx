'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, DollarSign, Settings, LayoutDashboard, ChevronLeft, ChevronRight, Users, CreditCard } from 'lucide-react'

const menuItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard, description: 'Overview' },
  { name: 'My Properties', href: '/dashboard/properties', icon: Building2, description: 'Houses & Rooms' },
  { name: 'Occupants', href: '/dashboard/occupants', icon: Users, description: 'Manage Tenants' },
  { name: 'Money', href: '/dashboard/finances', icon: DollarSign, description: 'Payments & Income' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'App Settings' },
  { name: 'Project Pricing', href: '/dashboard/pricing', icon: CreditCard, description: 'View Plans' },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
  appName?: string
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose, appName: propAppName }: SidebarProps) {
  const pathname = usePathname()
  const appName = propAppName || 'Property Manager'

  const handleLinkClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <aside 
      className={`bg-gray-900 text-white min-h-screen p-6 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isMobileOpen ? 'fixed inset-y-0 left-0 z-50 lg:relative' : 'hidden lg:block'
      }`}
    >
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
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        ) : (
          <h1 className="text-2xl font-bold">{appName}</h1>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="space-y-3">
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
    </aside>
  )
}
