import { prisma } from '../database'
import { RoomOccupant, Room } from '@prisma/client'

export interface RoomAssignmentData {
  occupantId: string
  fromRoomId?: string
  toRoomId: string
  moveInDate?: string
  assignedBy?: string
  reason?: string
  notes?: string
}

export interface RoomAssignmentHistory {
  id: string
  occupantId: string
  roomId: string
  action: 'assigned' | 'unassigned' | 'transferred' | 'status_changed'
  assignedBy?: string
  assignedAt: Date
  moveInDate?: Date
  moveOutDate?: Date
  notes?: string
}

export interface RoomAvailabilityCheck {
  available: boolean
  reason?: string
  currentOccupants: number
  maxOccupants: number
  availableSpace: number
}

export class RoomAssignmentService {
  /**
   * Get available rooms for a specific property
   */
  static async getAvailableRooms(propertyId?: string, minCapacity: number = 1): Promise<Room[]> {
    const whereClause: any = {
      status: 'available',
      maxOccupants: { gte: minCapacity }
    }
    
    if (propertyId) {
      whereClause.propertyId = propertyId
    }

    // Get rooms that have available space
    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            name: true,
            type: true
          }
        },
        occupants: {
          where: {
            assignmentStatus: 'active'
          }
        }
      },
      orderBy: [
        { propertyName: 'asc' },
        { roomNumber: 'asc' }
      ]
    })

    // Filter rooms that actually have space available
    return rooms.filter(room => {
      const activeOccupants = room.occupants.reduce((sum, occupant) => 
        sum + occupant.numberOfOccupants, 0
      )
      return activeOccupants < room.maxOccupants
    })
  }

  /**
   * Check if a room has available capacity
   */
  static async checkRoomAvailability(roomId: string, requiredCapacity: number = 1): Promise<RoomAvailabilityCheck> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        occupants: {
          where: {
            assignmentStatus: 'active'
          }
        }
      }
    })

    if (!room) {
      return {
        available: false,
        reason: 'Room not found',
        currentOccupants: 0,
        maxOccupants: 0,
        availableSpace: 0
      }
    }

    const currentOccupants = room.occupants.reduce((sum, occupant) => 
      sum + occupant.numberOfOccupants, 0
    )
    const availableSpace = room.maxOccupants - currentOccupants

    return {
      available: availableSpace >= requiredCapacity && room.status === 'available',
      reason: availableSpace < requiredCapacity ? 'Insufficient capacity' : 
              room.status !== 'available' ? `Room status is ${room.status}` : undefined,
      currentOccupants,
      maxOccupants: room.maxOccupants,
      availableSpace
    }
  }

  /**
   * Assign an occupant to a room
   */
  static async assignOccupantToRoom(
    occupantId: string, 
    roomId: string, 
    assignedBy?: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; occupant?: RoomOccupant }> {
    try {
      // Get occupant details
      const occupant = await prisma.roomOccupant.findUnique({
        where: { id: occupantId }
      })

      if (!occupant) {
        return { success: false, message: 'Occupant not found' }
      }

      // Check room availability
      const availability = await this.checkRoomAvailability(roomId, occupant.numberOfOccupants)
      if (!availability.available) {
        return { 
          success: false, 
          message: availability.reason || 'Room not available' 
        }
      }

      // Update occupant's room assignment
      const updatedOccupant = await prisma.roomOccupant.update({
        where: { id: occupantId },
        data: {
          roomId,
          assignmentStatus: 'active',
          assignedAt: new Date()
        }
      })

      // Update room occupancy and status
      await this.updateRoomOccupancy(roomId)

      // Log assignment history
      await this.logRoomAssignmentHistory({
        roomId,
        occupantId,
        action: 'assigned',
        assignedBy: assignedBy || 'system',
        reason: 'Room assignment',
        notes,
        effectiveDate: new Date().toISOString()
      })

      return { 
        success: true, 
        message: 'Occupant successfully assigned to room',
        occupant: updatedOccupant
      }
    } catch (error) {
      console.error('Room assignment error:', error)
      return { 
        success: false, 
        message: 'Failed to assign occupant to room' 
      }
    }
  }

  /**
   * Transfer occupant from one room to another
   */
  static async transferOccupant(data: RoomAssignmentData): Promise<{ success: boolean; message: string }> {
    try {
      const { occupantId, fromRoomId, toRoomId, assignedBy, reason, notes } = data

      // Get occupant details
      const occupant = await prisma.roomOccupant.findUnique({
        where: { id: occupantId }
      })

      if (!occupant) {
        return { success: false, message: 'Occupant not found' }
      }

      // Check new room availability
      const availability = await this.checkRoomAvailability(toRoomId, occupant.numberOfOccupants)
      if (!availability.available) {
        return { 
          success: false, 
          message: availability.reason || 'Target room not available' 
        }
      }

      // Update occupant's room assignment
      await prisma.roomOccupant.update({
        where: { id: occupantId },
        data: {
          roomId: toRoomId,
          assignedAt: new Date()
        }
      })

      // Update occupancy for both rooms
      if (fromRoomId) {
        await this.updateRoomOccupancy(fromRoomId)
      }
      await this.updateRoomOccupancy(toRoomId)

      // Log transfer history
      await this.logRoomAssignmentHistory({
        roomId: toRoomId,
        occupantId,
        action: 'transferred',
        assignedBy: assignedBy || 'system',
        reason: reason || 'Room transfer',
        notes,
        effectiveDate: new Date().toISOString()
      })

      return { 
        success: true, 
        message: 'Occupant successfully transferred to new room' 
      }
    } catch (error) {
      console.error('Room transfer error:', error)
      return { 
        success: false, 
        message: 'Failed to transfer occupant' 
      }
    }
  }

  /**
   * Remove occupant from room (move out)
   */
  static async removeOccupantFromRoom(
    occupantId: string, 
    reason?: string,
    assignedBy?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const occupant = await prisma.roomOccupant.findUnique({
        where: { id: occupantId }
      })

      if (!occupant) {
        return { success: false, message: 'Occupant not found' }
      }

      const roomId = occupant.roomId

      // Update occupant status to moved out
      await prisma.roomOccupant.update({
        where: { id: occupantId },
        data: {
          assignmentStatus: 'moved_out',
          moveOutDate: new Date().toISOString()
        }
      })

      // Update room occupancy
      await this.updateRoomOccupancy(roomId)

      // Log removal history
      await this.logRoomAssignmentHistory({
        roomId,
        occupantId,
        action: 'unassigned',
        assignedBy: assignedBy || 'system',
        reason: reason || 'Tenant moved out',
        effectiveDate: new Date().toISOString()
      })

      return { 
        success: true, 
        message: 'Occupant successfully removed from room' 
      }
    } catch (error) {
      console.error('Room removal error:', error)
      return { 
        success: false, 
        message: 'Failed to remove occupant from room' 
      }
    }
  }

  /**
   * Update room occupancy count and status
   */
  static async updateRoomOccupancy(roomId: string): Promise<void> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        occupants: {
          where: {
            assignmentStatus: 'active'
          }
        }
      }
    })

    if (!room) return

    const currentOccupants = room.occupants.reduce((sum, occupant) => 
      sum + occupant.numberOfOccupants, 0
    )

    const newStatus = currentOccupants >= room.maxOccupants ? 'occupied' : 'available'

    await prisma.room.update({
      where: { id: roomId },
      data: {
        currentOccupants,
        status: newStatus
      }
    })
  }

  /**
   * Log room assignment history
   */
  static async logRoomAssignmentHistory(data: {
    roomId: string
    occupantId?: string
    propertyId?: string
    action: string
    fromStatus?: string
    toStatus?: string
    assignedBy?: string
    reason?: string
    notes?: string
    effectiveDate: string
  }): Promise<void> {
    try {
      // Get property ID if not provided
      let propertyId = data.propertyId
      if (!propertyId) {
        const room = await prisma.room.findUnique({
          where: { id: data.roomId },
          select: { propertyId: true }
        })
        propertyId = room?.propertyId
      }

      await prisma.roomAssignmentHistory.create({
        data: {
          roomId: data.roomId,
          occupantId: data.occupantId,
          propertyId: propertyId || '',
          action: data.action,
          fromStatus: data.fromStatus,
          toStatus: data.toStatus,
          assignedBy: data.assignedBy,
          reason: data.reason,
          notes: data.notes,
          effectiveDate: data.effectiveDate
        }
      })
    } catch (error) {
      console.error('Failed to log room assignment history:', error)
    }
  }

  /**
   * Get room assignment history
   */
  static async getRoomAssignmentHistory(
    roomId?: string, 
    occupantId?: string,
    limit: number = 50
  ): Promise<any[]> {
    const whereClause: any = {}
    
    if (roomId) whereClause.roomId = roomId
    if (occupantId) whereClause.occupantId = occupantId

    return await prisma.roomAssignmentHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Get rooms with occupancy statistics
   */
  static async getRoomsWithOccupancy(propertyId?: string) {
    const whereClause = propertyId ? { propertyId } : {}
    
    return await prisma.room.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            name: true,
            type: true
          }
        },
        occupants: {
          where: {
            assignmentStatus: 'active'
          },
          select: {
            id: true,
            name: true,
            numberOfOccupants: true,
            rentStartDate: true,
            rentExpiryDate: true,
            paymentStatus: true
          }
        }
      },
      orderBy: [
        { propertyName: 'asc' },
        { roomNumber: 'asc' }
      ]
    })
  }
}