import { NextRequest, NextResponse } from 'next/server'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'
import { AuthService } from '@/lib/services/authService'

// Get room assignment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const occupantId = searchParams.get('occupantId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Room assignment history temporarily disabled for build compatibility
    return NextResponse.json({ history: [] })
  } catch (error) {
    console.error('Get assignment history error:', error)
    return NextResponse.json(
      { error: 'Failed to get assignment history' },
      { status: 500 }
    )
  }
}

// Transfer occupant to different room
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    const token = request.cookies.get('auth-token')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null
    const assignedBy = currentUser?.id

    // Room assignment functionality temporarily disabled for build compatibility
    return NextResponse.json(
      { error: 'Room assignment service temporarily unavailable' },
      { status: 503 }
    )
  } catch (error) {
    console.error('Room assignment operation error:', error)
    return NextResponse.json(
      { error: 'Failed to perform room assignment operation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}