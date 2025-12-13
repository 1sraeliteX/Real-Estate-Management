import api from '@/lib/api'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'payment' | 'maintenance' | 'tenant' | 'system' | 'reminder'
  isRead: boolean
  createdAt: string
  relatedId?: string
  relatedType?: 'property' | 'tenant' | 'payment'
}

export class NotificationClient {
  static async getNotifications(limit?: number): Promise<Notification[]> {
    const params = limit ? `?limit=${limit}` : ''
    const response = await api.get(`/api/notifications${params}`)
    return response.data
  }

  static async getUnreadCount(): Promise<number> {
    const response = await api.get('/api/notifications/unread-count')
    return response.data.count
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/api/notifications/${notificationId}/read`)
  }

  static async markAllAsRead(): Promise<void> {
    await api.patch('/api/notifications/mark-all-read')
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`)
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
    const response = await api.post('/api/notifications', notification)
    return response.data
  }
}