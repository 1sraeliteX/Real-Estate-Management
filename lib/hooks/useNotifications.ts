import { useState, useEffect, useCallback } from 'react'
import { NotificationClient, Notification } from '@/lib/client/notificationClient'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async (limit?: number) => {
    try {
      const data = await NotificationClient.getNotifications(limit)
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }, [])

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await NotificationClient.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
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
      await Promise.all([
        loadNotifications(5),
        loadUnreadCount()
      ])
      setLoading(false)
    }

    initialize()

    // Set up polling for real-time updates
    const interval = setInterval(refreshNotifications, 30000) // Poll every 30 seconds

    // Listen for custom notification events
    const handleNewNotification = () => {
      refreshNotifications()
    }

    window.addEventListener('newNotification', handleNewNotification)

    return () => {
      clearInterval(interval)
      window.removeEventListener('newNotification', handleNewNotification)
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