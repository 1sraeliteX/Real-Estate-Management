import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateRoom } from '@/lib/validation'
import { AuthService } from '@/lib/services/authService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    
    const whereClause = propertyId ? { propertyId } : {}
    
    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        occupants: true,
        property: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        roomNumber: 'asc'
      }
    })

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json(
      { error: 'Failed to get rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()
    
    // Validate room data
    const validation = validateRoom(roomData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    const room = await prisma.room.create({
      data: roomData,
      include: {
        occupants: true,
        property: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { error: 'Failed to create room', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}