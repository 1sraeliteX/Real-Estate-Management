import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function PATCH() {
  try {
    await NotificationService.initializeNotificationsTable()
    await NotificationService.markAllAsRead()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}