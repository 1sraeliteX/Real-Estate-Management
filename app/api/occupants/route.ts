import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateOccupant } from '@/lib/validation'
import { AuthService } from '@/lib/services/authService'
import { RoomAssignmentService } from '@/lib/services/roomAssignmentService'

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
    const token = request.cookies.get('session')?.value
    const currentUser = token ? await AuthService.validateSession(token) : null
    const assignedBy = currentUser?.id || 'system'

    // Check room availability using the service
    const availability = await RoomAssignmentService.checkRoomAvailability(
      occupantData.roomId, 
      occupantData.numberOfOccupants
    )

    if (!availability.available) {
      return NextResponse.json(
        { error: availability.reason || 'Room not available for assignment' },
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
        assignedBy: assignedBy,
        moveInDate: occupantData.rentStartDate
      }
    })

    // Update room occupancy using the service
    await RoomAssignmentService.updateRoomOccupancy(occupantData.roomId)

    // Log the assignment history
    await RoomAssignmentService.logRoomAssignmentHistory({
      roomId: occupantData.roomId,
      occupantId: occupant.id,
      action: 'assigned',
      assignedBy: assignedBy,
      reason: 'New tenant registration',
      notes: `Tenant ${occupant.name} assigned to room`,
      effectiveDate: new Date().toISOString()
    })

    const result = occupant

    // Transform JSON strings back to arrays for frontend response
    const transformedResult = {
      ...result,
      issues: JSON.parse(result.issues),
      notes: JSON.parse(result.notes)
    }

    return NextResponse.json({ 
      occupant: transformedResult,
      message: 'Tenant successfully assigned to room'
    })
  } catch (error) {
    console.error('Create occupant error:', error)
    
    // Handle specific database constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'This room assignment conflicts with existing data. Please refresh and try again.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add tenant. Please try again.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}