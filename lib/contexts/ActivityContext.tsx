'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { ActivityClient } from '@/lib/client/activityClient'
import { Activity } from '@prisma/client'
import Toast from '@/components/Toast'

interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (type: string, category: string, description: string) => Promise<void>
  showToast: (message: string, type: ToastNotification['type']) => void
  refreshActivities: () => Promise<void>
  loading: boolean
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [loading, setLoading] = useState(false)

  // Load activities from database on mount
  const refreshActivities = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedActivities = await ActivityClient.getActivities(50)
      setActivities(Array.isArray(fetchedActivities) ? fetchedActivities : [])
    } catch (error) {
      console.error('Failed to load activities:', error)
      setActivities([]) // Set safe default
      // Don't show toast on initial load failure
    } finally {
      setLoading(false)
    }
  }, []) // Remove showToast dependency to avoid circular reference

  // Don't automatically load activities on mount to avoid API errors
  // useEffect(() => {
  //   refreshActivities()
  // }, [refreshActivities])

  const addActivity = useCallback(async (
    type: string,
    category: string,
    description: string
  ) => {
    try {
      const activity = await ActivityClient.createActivity({
        type: category,
        title: `${category} ${type}`,
        description,
        metadata: { action: type, category }
      })

      // Add to local state for immediate UI update
      setActivities(prev => [activity, ...prev.slice(0, 49)])

      // Auto-show toast notification
      const actionEmoji = {
        added: '✅',
        created: '✅',
        updated: '✏️',
        deleted: '🗑️'
      }
      const emoji = actionEmoji[type as keyof typeof actionEmoji] || '📝'
      showToast(`${emoji} ${description}`, 'success')
    } catch (error) {
      console.error('Failed to add activity:', error)
      showToast('Failed to log activity', 'error')
    }
  }, [])

  const showToast = useCallback((message: string, type: ToastNotification['type']) => {
    const newToast: ToastNotification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      addActivity, 
      showToast, 
      refreshActivities, 
      loading 
    }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider')
  }
  return context
}
