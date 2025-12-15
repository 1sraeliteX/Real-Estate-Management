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

    // Get current user for assignment tracking
    const token = request.cookies.get('auth-token')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null
    const assignedBy = currentUser?.id

    // Check if room exists and has capacity
    const room = await prisma.room.findUnique({
      where: { id: occupantData.roomId },
      include: { property: true }
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Check room capacity
    if (room.currentOccupants + occupantData.numberOfOccupants > room.maxOccupants) {
      return NextResponse.json(
        { error: 'Room capacity exceeded' },
        { status: 400 }
      )
    }

    // Create the occupant
    const occupant = await prisma.roomOccupant.create({
      data: {
        roomId: occupantData.roomId,
        name: occupantData.name,
        phone: occupantData.phone,
        email: occupantData.email || '',
        nextOfKin: occupantData.nextOfKin,
        nextOfKinPhone: occupantData.nextOfKinPhone,
        numberOfOccupants: occupantData.numberOfOccupants,
        kitchenAccess: occupantData.kitchenAccess || 'shared',
        rentStartDate: occupantData.rentStartDate,
        rentExpiryDate: occupantData.rentExpiryDate,
        totalRent: occupantData.totalRent,
        amountPaid: occupantData.amountPaid,
        paymentStatus: occupantData.amountPaid >= occupantData.totalRent ? 'completed' : 'pending',
        assignmentStatus: 'active',
        securityDeposit: occupantData.securityDeposit || 0,
        depositStatus: 'pending',
        emergencyContact: occupantData.emergencyContact || '',
        occupation: occupantData.occupation || '',
        idNumber: occupantData.idNumber || '',
        issues: JSON.stringify(occupantData.issues || []),
        notes: JSON.stringify(occupantData.notes || []),
        assignedBy: assignedBy || 'system'
      }
    })

    // Update room occupancy
    await prisma.room.update({
      where: { id: occupantData.roomId },
      data: {
        currentOccupants: room.currentOccupants + occupantData.numberOfOccupants,
        status: room.currentOccupants + occupantData.numberOfOccupants >= room.maxOccupants ? 'occupied' : 'available'
      }
    })

    // Transform JSON strings back to arrays for frontend response
    const result = {
      ...occupant,
      issues: JSON.parse(occupant.issues),
      notes: JSON.parse(occupant.notes)
    }

    return NextResponse.json({ occupant: result })
  } catch (error) {
    console.error('Create occupant error:', error)
    return NextResponse.json(
      { error: 'Failed to add tenant. Please try again.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}