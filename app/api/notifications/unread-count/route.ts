import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function GET() {
  try {
    await NotificationService.initializeNotificationsTable()
    const count = await NotificationService.getUnreadCount()
    
    return NextResponse.json({ count })
  } catch (error) {
    return handleApiError(error)
  }
}