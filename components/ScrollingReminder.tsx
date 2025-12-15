'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { AuthClient } from '@/lib/client/authClient'

export default function ScrollingReminder() {
  const [reminderText, setReminderText] = useState('')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReminder = async () => {
      try {
        setIsLoading(true)
        
        // Try to get user settings, but don't fail if not authenticated
        const userSettings = await AuthClient.getUserSettings()
        if (userSettings) {
          setReminderText(userSettings.reminderText || '')
          setReminderEnabled(userSettings.reminderEnabled || false)
        }
      } catch (error) {
        // Silently handle authentication errors - user might not be logged in
        console.debug('Reminder settings not available:', error)
        setReminderEnabled(false)
        setReminderText('')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadReminder()
  }, [])

  // Don't render anything while loading or if not enabled/visible
  if (isLoading || !reminderEnabled || !reminderText || !isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 relative overflow-hidden sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 overflow-hidden">
          <div className="scrolling-text whitespace-nowrap">
            <span className="text-sm font-medium">
              📢 {reminderText}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          title="Dismiss reminder"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .scrolling-text {
          animation: scroll 20s linear infinite;
        }
        
        .scrolling-text:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}