import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { AuthService } from '@/lib/services/authService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { newRoomId } = await request.json()
    const occupantId = params.id

    if (!newRoomId) {
      return NextResponse.json(
        { error: 'New room ID is required' },
        { status: 400 }
      )
    }

    // Get current user for assignment tracking
    const token = request.cookies.get('auth-token')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null

    // Get the occupant and current room
    const occupant = await prisma.roomOccupant.findUnique({
      where: { id: occupantId },
      include: { room: true }
    })

    if (!occupant) {
      return NextResponse.json(
        { error: 'Occupant not found' },
        { status: 404 }
      )
    }

    // Get the new room
    const newRoom = await prisma.room.findUnique({
      where: { id: newRoomId }
    })

    if (!newRoom) {
      return NextResponse.json(
        { error: 'New room not found' },
        { status: 404 }
      )
    }

    // Check if new room has capacity
    if (newRoom.currentOccupants + occupant.numberOfOccupants > newRoom.maxOccupants) {
      return NextResponse.json(
        { error: 'New room does not have enough capacity' },
        { status: 400 }
      )
    }

    // Start transaction to update both rooms and occupant
    await prisma.$transaction(async (tx) => {
      // Update occupant's room assignment
      await tx.roomOccupant.update({
        where: { id: occupantId },
        data: { 
          roomId: newRoomId,
          assignedBy: currentUser?.id || 'system',
          assignedAt: new Date()
        }
      })

      // Update old room occupancy
      await tx.room.update({
        where: { id: occupant.roomId },
        data: {
          currentOccupants: occupant.room.currentOccupants - occupant.numberOfOccupants,
          status: occupant.room.currentOccupants - occupant.numberOfOccupants === 0 ? 'available' : 
                  occupant.room.currentOccupants - occupant.numberOfOccupants < occupant.room.maxOccupants ? 'available' : 'occupied'
        }
      })

      // Update new room occupancy
      await tx.room.update({
        where: { id: newRoomId },
        data: {
          currentOccupants: newRoom.currentOccupants + occupant.numberOfOccupants,
          status: newRoom.currentOccupants + occupant.numberOfOccupants >= newRoom.maxOccupants ? 'occupied' : 'available'
        }
      })

      // Log the assignment history
      await tx.roomAssignmentHistory.create({
        data: {
          roomId: newRoomId,
          occupantId: occupantId,
          propertyId: newRoom.propertyId,
          action: 'transferred',
          fromStatus: occupant.room.status,
          toStatus: newRoom.status,
          assignedBy: currentUser?.id || 'system',
          reason: 'Room reassignment',
          notes: `Moved from Room ${occupant.room.roomNumber} to Room ${newRoom.roomNumber}`,
          effectiveDate: new Date().toISOString()
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      message: `Successfully moved ${occupant.name} to Room ${newRoom.roomNumber}` 
    })

  } catch (error) {
    console.error('Room assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to assign room', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}