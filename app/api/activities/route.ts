import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/authService'
import { ActivityService } from '@/lib/services/activityService'

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return await AuthService.validateSession(token)
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')

    let activities
    if (type) {
      activities = await ActivityService.getActivitiesByType(type, user?.id)
    } else {
      activities = await ActivityService.getRecentActivities(user?.id, limit)
    }

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const activityData = await request.json()

    const activity = await ActivityService.createActivity({
      ...activityData,
      userId: user?.id,
    })

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Create activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}