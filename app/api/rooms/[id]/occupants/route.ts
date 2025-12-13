import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const occupants = await prisma.roomOccupant.findMany({
      where: { roomId: params.id },
      include: {
        room: {
          include: {
            property: {
              select: {
                name: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform JSON strings back to arrays for frontend response
    const result = occupants.map(occupant => ({
      ...occupant,
      issues: JSON.parse(occupant.issues || '[]'),
      notes: JSON.parse(occupant.notes || '[]')
    }))

    return NextResponse.json({ occupants: result })
  } catch (error) {
    console.error('Get room occupants error:', error)
    return NextResponse.json(
      { error: 'Failed to get room occupants' },
      { status: 500 }
    )
  }
}