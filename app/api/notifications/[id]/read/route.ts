import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationService.initializeNotificationsTable()
    
    await NotificationService.markAsRead(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}