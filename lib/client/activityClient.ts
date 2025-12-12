import { Activity } from '@prisma/client'

export interface ActivityData {
  type: string
  title: string
  description?: string
  metadata?: Record<string, any>
}

export class ActivityClient {
  static async getActivities(limit?: number, type?: string): Promise<Activity[]> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (type) params.append('type', type)

    const response = await fetch(`/api/activities?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to get activities')
    }

    const data = await response.json()
    return data.activities
  }

  static async createActivity(activityData: ActivityData): Promise<Activity> {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create activity')
    }

    const data = await response.json()
    return data.activity
  }

  // Helper methods for common activities
  static async logPropertyActivity(
    action: 'created' | 'updated' | 'deleted',
    propertyName: string
  ): Promise<Activity> {
    return await this.createActivity({
      type: 'property',
      title: `Property ${action}`,
      description: `Property "${propertyName}" was ${action}`,
      metadata: { propertyName, action },
    })
  }

  static async logPaymentActivity(
    action: 'received' | 'overdue' | 'reminder_sent',
    tenantName: string,
    amount: number
  ): Promise<Activity> {
    return await this.createActivity({
      type: 'payment',
      title: `Payment ${action}`,
      description: `Payment of $${amount} from ${tenantName} is ${action}`,
      metadata: { tenantName, amount, action },
    })
  }
}