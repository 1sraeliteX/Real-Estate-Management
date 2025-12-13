import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateOccupant } from '@/lib/validation'
import { AuthService } from '@/lib/services/authService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    
    const whereClause = roomId ? { roomId } : {}
    
    const occupants = await prisma.roomOccupant.findMany({
      where: whereClause,
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

    return NextResponse.json({ occupants })
  } catch (error) {
    console.error('Get occupants error:', error)
    return NextResponse.json(
      { error: 'Failed to get occupants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const occupantData = await request.json()
    
    // Validate occupant data
    const validation = validateOccupant(occupantData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Convert arrays to JSON strings for database storage
    const transformedData = {
      ...occupantData,
      issues: JSON.stringify(occupantData.issues || []),
      notes: JSON.stringify(occupantData.notes || [])
    }

    const occupant = await prisma.roomOccupant.create({
      data: transformedData,
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
      }
    })

    // Transform JSON strings back to arrays for frontend response
    const result = {
      ...occupant,
      issues: JSON.parse(occupant.issues || '[]'),
      notes: JSON.parse(occupant.notes || '[]')
    }

    return NextResponse.json({ occupant: result })
  } catch (error) {
    console.error('Create occupant error:', error)
    return NextResponse.json(
      { error: 'Failed to create occupant', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}