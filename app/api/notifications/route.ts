import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notificationService'
import { handleApiError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  try {
    await NotificationService.initializeNotificationsTable()
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    
    const notifications = await NotificationService.getNotifications(
      limit ? parseInt(limit) : undefined
    )
    
    return NextResponse.json(notifications)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await NotificationService.initializeNotificationsTable()
    
    const body = await request.json()
    const notification = await NotificationService.createNotification(body)
    
    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}