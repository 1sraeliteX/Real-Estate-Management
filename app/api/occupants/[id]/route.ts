import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateOccupant } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const occupant = await prisma.roomOccupant.findUnique({
      where: { id: params.id },
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

    if (!occupant) {
      return NextResponse.json(
        { error: 'Occupant not found' },
        { status: 404 }
      )
    }

    // Transform JSON strings back to arrays for frontend response
    const result = {
      ...occupant,
      issues: JSON.parse(occupant.issues || '[]'),
      notes: JSON.parse(occupant.notes || '[]')
    }

    return NextResponse.json({ occupant: result })
  } catch (error) {
    console.error('Get occupant error:', error)
    return NextResponse.json(
      { error: 'Failed to get occupant' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const occupant = await prisma.roomOccupant.update({
      where: { id: params.id },
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
    console.error('Update occupant error:', error)
    return NextResponse.json(
      { error: 'Failed to update occupant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const occupant = await prisma.roomOccupant.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ occupant })
  } catch (error) {
    console.error('Delete occupant error:', error)
    return NextResponse.json(
      { error: 'Failed to delete occupant' },
      { status: 500 }
    )
  }
}