import { NotificationClient } from '@/lib/client/notificationClient'

export class NotificationTrigger {
  static async createPaymentNotification(tenantName: string, amount: number, propertyId?: string) {
    try {
      await NotificationClient.createNotification({
        title: 'Payment Received',
        message: `${tenantName} paid ₦${amount.toLocaleString()}`,
        type: 'payment',
        relatedId: propertyId,
        relatedType: 'payment'
      })
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('newNotification'))
    } catch (error) {
      console.error('Failed to create payment notification:', error)
    }
  }

  static async createMaintenanceNotification(description: string, propertyId?: string) {
    try {
      await NotificationClient.createNotification({
        title: 'Maintenance Request',
        message: description,
        type: 'maintenance',
        relatedId: propertyId,
        relatedType: 'property'
      })
      
      window.dispatchEvent(new CustomEvent('newNotification'))
    } catch (error) {
      console.error('Failed to create maintenance notification:', error)
    }
  }

  static async createTenantNotification(message: string, tenantId?: string) {
    try {
      await NotificationClient.createNotification({
        title: 'Tenant Update',
        message,
        type: 'tenant',
        relatedId: tenantId,
        relatedType: 'tenant'
      })
      
      window.dispatchEvent(new CustomEvent('newNotification'))
    } catch (error) {
      console.error('Failed to create tenant notification:', error)
    }
  }

  static async createSystemNotification(title: string, message: string) {
    try {
      await NotificationClient.createNotification({
        title,
        message,
        type: 'system'
      })
      
      window.dispatchEvent(new CustomEvent('newNotification'))
    } catch (error) {
      console.error('Failed to create system notification:', error)
    }
  }

  static async createReminderNotification(title: string, message: string, relatedId?: string, relatedType?: 'property' | 'tenant') {
    try {
      await NotificationClient.createNotification({
        title,
        message,
        type: 'reminder',
        relatedId,
        relatedType
      })
      
      window.dispatchEvent(new CustomEvent('newNotification'))
    } catch (error) {
      console.error('Failed to create reminder notification:', error)
    }
  }
}