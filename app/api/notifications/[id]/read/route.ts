import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await NotificationService.initializeNotificationsTable()
    
    const { id } = await params
    await NotificationService.markAsRead(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}