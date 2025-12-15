import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { AuthService } from '@/lib/services/authService'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'

// Get all rooms for a specific property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params
    
    const rooms = await RoomAssignmentService.getRoomsWithOccupancy(propertyId)

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Get property rooms error:', error)
    return NextResponse.json(
      { error: 'Failed to get property rooms' },
      { status: 500 }
    )
  }
}

// Create rooms for a property
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params
    const { rooms } = await request.json()
    
    if (!rooms || !Array.isArray(rooms)) {
      return NextResponse.json(
        { error: 'Rooms array is required' },
        { status: 400 }
      )
    }

    // Get current user for tracking
    const token = request.cookies.get('session')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { name: true }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Validate room data and create rooms
    const createdRooms = []
    
    for (const roomData of rooms) {
      // Validate required fields
      if (!roomData.roomPrefix || !roomData.roomNumber) {
        return NextResponse.json(
          { error: 'Room prefix and number are required for all rooms' },
          { status: 400 }
        )
      }

      // Create room identifier
      const roomIdentifier = `${roomData.roomPrefix}-${roomData.roomNumber}`

      // Check for duplicate room identifiers within the property
      const existingRoom = await prisma.room.findFirst({
        where: {
          AND: [
            { propertyId },
            { roomPrefix: roomData.roomPrefix },
            { roomNumber: roomData.roomNumber }
          ]
        }
      })

      if (existingRoom) {
        return NextResponse.json(
          { error: `Room ${roomIdentifier} already exists in this property` },
          { status: 400 }
        )
      }

      // Create the room
      const room = await prisma.room.create({
        data: {
          propertyId,
          propertyName: property.name,
          roomPrefix: roomData.roomPrefix,
          roomNumber: roomData.roomNumber,
          roomIdentifier,
          status: 'available',
          yearlyRent: roomData.yearlyRent || 0,
          maxOccupants: roomData.maxOccupants || 1,
          currentOccupants: 0,
          roomType: roomData.roomType || 'single',
          amenities: roomData.amenities ? JSON.stringify(roomData.amenities) : null,
          floor: roomData.floor || null,
          size: roomData.size || null,
          hasPrivateBath: roomData.hasPrivateBath || false,
          hasKitchen: roomData.hasKitchen || false
        }
      })

      createdRooms.push(room)

      // Log room creation
      await RoomAssignmentService.logRoomAssignmentHistory({
        roomId: room.id,
        propertyId,
        action: 'created',
        assignedBy: currentUser?.id || 'system',
        reason: 'Room created during property setup',
        effectiveDate: new Date().toISOString()
      })
    }

    return NextResponse.json({ 
      rooms: createdRooms,
      message: `Successfully created ${createdRooms.length} rooms`
    })
  } catch (error) {
    console.error('Create property rooms error:', error)
    return NextResponse.json(
      { error: 'Failed to create rooms', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}