// Room Assignment Service - Temporarily disabled for build compatibility

export interface RoomAssignmentData {
  occupantId: string
  fromRoomId?: string
  toRoomId: string
  moveInDate?: string
  assignedBy?: string
}

export interface RoomAssignmentHistory {
  id: string
  occupantId: string
  roomId: string
  action: 'assigned' | 'unassigned' | 'transferred'
  assignedBy?: string
  assignedAt: Date
  moveInDate?: Date
  moveOutDate?: Date
  notes?: string
}

export class RoomAssignmentService {
  // Service temporarily disabled for build compatibility
  static async getRoomAssignmentHistory() {
    return []
  }
  
  static async transferOccupant() {
    throw new Error('Service temporarily unavailable')
  }
  
  static async removeOccupantFromRoom() {
    throw new Error('Service temporarily unavailable')
  }
  
  static async checkRoomAvailability() {
    return { available: false }
  }
}