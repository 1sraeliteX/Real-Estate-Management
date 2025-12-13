'use client'

import { useState, useEffect } from 'react'
import { Bell, Trash2, Check, CheckCheck, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { NotificationClient, Notification } from '@/lib/client/notificationClient'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await NotificationClient.getNotifications()
      setNotifications(data)
    } catch (err) {
      setError('Failed to load notifications')
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationClient.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await NotificationClient.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationClient.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return '💰'
      case 'maintenance':
        return '🔧'
      case 'tenant':
        return '👥'
      case 'system':
        return '⚙️'
      case 'reminder':
        return '⏰'
      default:
        return '📢'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadNotifications}
            className="mt-2 text-red-600 hover:text-red-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You'll see notifications here when there's activity in your property management.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                !notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}