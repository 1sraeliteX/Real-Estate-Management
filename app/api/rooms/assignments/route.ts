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
    
    const assignments = await RoomAssignmentService.getRoomAssignmentHistory(
      roomId || undefined,
      occupantId || undefined,
      limit
    )

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error('Get assignment history error:', error)
    return NextResponse.json(
      { error: 'Failed to get assignment history' },
      { status: 500 }
    )
  }
}

// Handle room assignment operations (assign, transfer, remove)
export async function POST(request: NextRequest) {
  try {
    const { action, occupantId, roomId, fromRoomId, reason, notes } = await request.json()
    
    if (!occupantId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: occupantId, action' },
        { status: 400 }
      )
    }

    // Get current user for assignment tracking
    const token = request.cookies.get('session')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null
    const assignedBy = currentUser?.id || 'system'

    let result

    switch (action) {
      case 'assign':
        if (!roomId) {
          return NextResponse.json(
            { error: 'roomId is required for assign action' },
            { status: 400 }
          )
        }
        result = await RoomAssignmentService.assignOccupantToRoom(
          occupantId, 
          roomId, 
          assignedBy, 
          notes
        )
        break
        
      case 'transfer':
        if (!roomId) {
          return NextResponse.json(
            { error: 'roomId is required for transfer action' },
            { status: 400 }
          )
        }
        result = await RoomAssignmentService.transferOccupant({
          occupantId,
          fromRoomId,
          toRoomId: roomId,
          assignedBy,
          reason,
          notes
        })
        break
        
      case 'remove':
        result = await RoomAssignmentService.removeOccupantFromRoom(
          occupantId,
          reason,
          assignedBy
        )
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: assign, transfer, or remove' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message,
        occupant: result.occupant 
      })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Room assignment operation error:', error)
    return NextResponse.json(
      { error: 'Failed to perform room assignment operation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}