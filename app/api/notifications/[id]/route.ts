import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationService.initializeNotificationsTable()
    
    const url = new URL(request.url)
    if (url.pathname.endsWith('/read')) {
      await NotificationService.markAsRead(params.id)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationService.initializeNotificationsTable()
    await NotificationService.deleteNotification(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}