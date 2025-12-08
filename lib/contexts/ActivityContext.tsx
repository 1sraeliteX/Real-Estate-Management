'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import Toast from '@/components/Toast'

interface Activity {
  id: string
  type: 'added' | 'updated' | 'deleted'
  category: 'property' | 'occupant' | 'room' | 'payment' | 'maintenance'
  description: string
  timestamp: string
}

interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (type: Activity['type'], category: Activity['category'], description: string) => void
  showToast: (message: string, type: ToastNotification['type']) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

const MAX_ACTIVITIES = 50

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Load activities from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentActivities')
    if (saved) {
      try {
        setActivities(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load activities:', e)
      }
    }
  }, [])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('recentActivities', JSON.stringify(activities))
    }
  }, [activities])

  const addActivity = useCallback((
    type: Activity['type'],
    category: Activity['category'],
    description: string
  ) => {
    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      category,
      description,
      timestamp: new Date().toISOString()
    }

    setActivities(prev => {
      const updated = [newActivity, ...prev]
      return updated.slice(0, MAX_ACTIVITIES)
    })

    // Auto-show toast notification
    const actionEmoji = {
      added: '✅',
      updated: '✏️',
      deleted: '🗑️'
    }
    showToast(`${actionEmoji[type]} ${description}`, 'success')
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
    <ActivityContext.Provider value={{ activities, addActivity, showToast }}>
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
