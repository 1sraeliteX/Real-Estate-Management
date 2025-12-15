import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await NotificationService.initializeNotificationsTable()
    
    await NotificationService.deleteNotification(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await NotificationService.initializeNotificationsTable()
    
    const url = new URL(request.url)
    const pathname = url.pathname
    
    if (pathname.endsWith('/read')) {
      await NotificationService.markAsRead(id)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
  } catch (error) {
    return handleApiError(error)
  }
}