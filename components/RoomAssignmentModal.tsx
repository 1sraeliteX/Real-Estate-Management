'use client'

import { useState } from 'react'
import { X, Home, Users } from 'lucide-react'
import { RoomOccupant } from '@/types'

interface RoomAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  occupant: RoomOccupant
  availableRooms: Array<{
    id: string
    roomNumber: string
    propertyName: string
    maxOccupants: number
    currentOccupants: number
    availableSpace?: number
  }>
  onAssign: (occupantId: string, newRoomId: string) => void
}

export default function RoomAssignmentModal({ 
  isOpen, 
  onClose, 
  occupant, 
  availableRooms, 
  onAssign 
}: RoomAssignmentModalProps) {
  const [selectedRoomId, setSelectedRoomId] = useState('')

  if (!isOpen) return null

  const handleAssign = () => {
    if (!selectedRoomId) {
      alert('Please select a room')
      return
    }
    onAssign(occupant.id, selectedRoomId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🏠 Assign Room</h2>
            <p className="text-sm text-gray-600">Move {occupant.name} to a different room</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Current Assignment</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Currently in Room {(occupant as any).roomNumber || occupant.roomId}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select New Room
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a room...</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.propertyName} - Room {room.roomNumber} 
                  ({room.availableSpace || (room.maxOccupants - room.currentOccupants)} spaces available)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}