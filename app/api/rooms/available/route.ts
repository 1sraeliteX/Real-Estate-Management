import { NextRequest, NextResponse } from 'next/server'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const minCapacity = parseInt(searchParams.get('minCapacity') || '1')
    
    // Available rooms service temporarily disabled
    return NextResponse.json({ rooms: [] })
  } catch (error) {
    console.error('Get available rooms error:', error)
    return NextResponse.json(
      { error: 'Failed to get available rooms' },
      { status: 500 }
    )
  }
}