import { prisma } from '../database'
import { Activity } from '@prisma/client'

export interface ActivityData {
  type: string
  title: string
  description?: string
  metadata?: Record<string, any>
  userId?: string
}

export class ActivityService {
  static async createActivity(activityData: ActivityData): Promise<Activity> {
    return await prisma.activity.create({
      data: {
        ...activityData,
        metadata: activityData.metadata ? JSON.stringify(activityData.metadata) : null,
      },
    })
  }

  static async getRecentActivities(userId?: string, limit: number = 10): Promise<Activity[]> {
    return await prisma.activity.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  }

  static async getActivitiesByType(type: string, userId?: string): Promise<Activity[]> {
    return await prisma.activity.findMany({
      where: {
        type,
        ...(userId && { userId }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async deleteOldActivities(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    await prisma.activity.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })
  }

  // Helper methods for common activity types
  static async logPropertyActivity(
    type: 'created' | 'updated' | 'deleted',
    propertyName: string,
    userId?: string
  ): Promise<Activity> {
    return await this.createActivity({
      type: 'property',
      title: `Property ${type}`,
      description: `Property "${propertyName}" was ${type}`,
      metadata: { propertyName, action: type },
      userId,
    })
  }

  static async logPaymentActivity(
    type: 'received' | 'overdue' | 'reminder_sent',
    tenantName: string,
    amount: number,
    userId?: string
  ): Promise<Activity> {
    return await this.createActivity({
      type: 'payment',
      title: `Payment ${type}`,
      description: `Payment of $${amount} from ${tenantName} is ${type}`,
      metadata: { tenantName, amount, action: type },
      userId,
    })
  }

  static async logMaintenanceActivity(
    type: 'requested' | 'completed' | 'assigned',
    title: string,
    propertyName: string,
    userId?: string
  ): Promise<Activity> {
    return await this.createActivity({
      type: 'maintenance',
      title: `Maintenance ${type}`,
      description: `"${title}" at ${propertyName} was ${type}`,
      metadata: { maintenanceTitle: title, propertyName, action: type },
      userId,
    })
  }
}