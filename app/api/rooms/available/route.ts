import { NextRequest, NextResponse } from 'next/server'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const minCapacity = parseInt(searchParams.get('minCapacity') || '1')
    
    const availableRooms = await RoomAssignmentService.getAvailableRooms(
      propertyId || undefined, 
      minCapacity
    )

    // Transform rooms to include availability info
    const roomsWithAvailability = availableRooms.map(room => {
      const activeOccupants = room.occupants?.reduce((sum, occupant) => 
        sum + occupant.numberOfOccupants, 0
      ) || 0
      
      return {
        id: room.id,
        propertyId: room.propertyId,
        propertyName: room.propertyName,
        roomPrefix: room.roomPrefix,
        roomNumber: room.roomNumber,
        roomIdentifier: room.roomIdentifier,
        status: room.status,
        yearlyRent: room.yearlyRent,
        maxOccupants: room.maxOccupants,
        currentOccupants: activeOccupants,
        availableSpace: room.maxOccupants - activeOccupants,
        roomType: room.roomType,
        amenities: room.amenities,
        floor: room.floor,
        size: room.size,
        hasPrivateBath: room.hasPrivateBath,
        hasKitchen: room.hasKitchen,
        property: room.property
      }
    })

    return NextResponse.json({ 
      rooms: roomsWithAvailability,
      total: roomsWithAvailability.length
    })
  } catch (error) {
    console.error('Get available rooms error:', error)
    return NextResponse.json(
      { error: 'Failed to get available rooms' },
      { status: 500 }
    )
  }
}