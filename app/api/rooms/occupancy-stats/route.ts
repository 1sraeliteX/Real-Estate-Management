import { NextRequest, NextResponse } from 'next/server'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    
    // Occupancy stats service temporarily disabled
    return NextResponse.json({ stats: { totalRooms: 0, occupiedRooms: 0, availableRooms: 0 } })
  } catch (error) {
    console.error('Get occupancy stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get occupancy stats' },
      { status: 500 }
    )
  }
}