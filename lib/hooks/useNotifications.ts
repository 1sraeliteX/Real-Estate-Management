import { useState, useEffect, useCallback } from 'react'
import { NotificationClient, Notification } from '@/lib/client/notificationClient'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async (limit?: number) => {
    try {
      const data = await NotificationClient.getNotifications(limit)
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([]) // Set safe default
    }
  }, [])

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await NotificationClient.getUnreadCount()
      setUnreadCount(typeof count === 'number' ? count : 0)
    } catch (error) {
      console.error('Error loading unread count:', error)
      setUnreadCount(0) // Set safe default
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationClient.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationClient.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  const refreshNotifications = useCallback(() => {
    loadNotifications(5) // Load recent 5 for dropdown
    loadUnreadCount()
  }, [loadNotifications, loadUnreadCount])

  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      try {
        await Promise.all([
          loadNotifications(5),
          loadUnreadCount()
        ])
      } catch (error) {
        console.error('Error initializing notifications:', error)
        // Set safe defaults
        setNotifications([])
        setUnreadCount(0)
      } finally {
        setLoading(false)
      }
    }

    initialize()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      try {
        refreshNotifications()
      } catch (error) {
        console.error('Error refreshing notifications:', error)
      }
    }, 30000) // Poll every 30 seconds

    // Listen for custom notification events
    const handleNewNotification = () => {
      try {
        refreshNotifications()
      } catch (error) {
        console.error('Error handling new notification:', error)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('newNotification', handleNewNotification)
    }

    return () => {
      clearInterval(interval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('newNotification', handleNewNotification)
      }
    }
  }, [loadNotifications, loadUnreadCount, refreshNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  }
}