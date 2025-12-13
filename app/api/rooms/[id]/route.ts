import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateRoom } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
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

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Get room error:', error)
    return NextResponse.json(
      { error: 'Failed to get room' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const room = await prisma.room.update({
      where: { id: params.id },
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
    console.error('Update room error:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Delete room error:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}