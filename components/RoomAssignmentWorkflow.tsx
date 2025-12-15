'use client'

import { useState, useEffect } from 'react'
import { Home, Users, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'

interface Room {
  id: string
  propertyId: string
  propertyName: string
  roomPrefix: string
  roomNumber: string
  roomIdentifier: string
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  yearlyRent: number
  maxOccupants: number
  currentOccupants: number
  availableSpace: number
  roomType: string
  amenities: string
  floor?: number
  size?: number
  hasPrivateBath: boolean
  hasKitchen: boolean
}

interface Occupant {
  id: string
  name: string
  phone: string
  numberOfOccupants: number
  assignmentStatus: string
  rentStartDate: string
  rentExpiryDate: string
  paymentStatus: string
}

interface RoomAssignmentWorkflowProps {
  propertyId?: string
  onAssignmentComplete?: () => void
}

export default function RoomAssignmentWorkflow({ 
  propertyId, 
  onAssignmentComplete 
}: RoomAssignmentWorkflowProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [propertyId])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const url = propertyId 
        ? `/api/rooms?propertyId=${propertyId}` 
        : '/api/rooms'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        // Calculate availability for each room
        const roomsWithAvailability = data.rooms.map((room: any) => {
          const activeOccupants = room.occupants?.filter(
            (occ: any) => occ.assignmentStatus === 'active'
          ).reduce((sum: number, occ: any) => sum + occ.numberOfOccupants, 0) || 0
          
          return {
            ...room,
            currentOccupants: activeOccupants,
            availableSpace: room.maxOccupants - activeOccupants,
            amenities: room.amenities ? JSON.parse(room.amenities) : []
          }
        })
        
        setRooms(roomsWithAvailability)
      } else {
        setError(data.error || 'Failed to fetch rooms')
      }
    } catch (err) {
      setError('Failed to fetch rooms')
      console.error('Fetch rooms error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'occupied': return 'text-red-600 bg-red-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      case 'reserved': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'occupied': return <Users className="w-4 h-4" />
      case 'maintenance': return <AlertCircle className="w-4 h-4" />
      case 'reserved': return <Clock className="w-4 h-4" />
      default: return <Home className="w-4 h-4" />
    }
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    if (room.availableSpace > 0) {
      setShowAssignmentModal(true)
    }
  }

  const handleMoveOut = async (roomId: string, occupantId: string) => {
    try {
      const response = await fetch('/api/rooms/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          occupantId,
          reason: 'Tenant moved out'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        await fetchRooms() // Refresh room data
        onAssignmentComplete?.()
      } else {
        setError(data.error || 'Failed to process move out')
      }
    } catch (err) {
      setError('Failed to process move out')
      console.error('Move out error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading rooms...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">Error</p>
        </div>
        <p className="text-red-700 text-sm mt-1">{error}</p>
        <button
          onClick={fetchRooms}
          className="mt-2 text-red-600 text-sm underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Room Assignment Workflow</h2>
          <p className="text-sm text-gray-600">
            Manage room assignments and track occupancy status
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span className="text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span className="text-gray-600">Maintenance</span>
          </div>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Home className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Found</h3>
          <p className="text-gray-600 mb-4">
            {propertyId 
              ? 'This property has no rooms configured yet.' 
              : 'No properties have rooms configured yet.'
            }
          </p>
          <p className="text-sm text-gray-500">
            Configure rooms for your properties to enable tenant assignments.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                room.availableSpace > 0 
                  ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => handleRoomSelect(room)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {room.propertyName} - {room.roomIdentifier}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {room.roomType} • Floor {room.floor || 'N/A'}
                        {room.size && ` • ${room.size}m²`}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusIcon(room.status)}
                    <span className="capitalize">{room.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Occupancy</p>
                    <p className="font-semibold">
                      {room.currentOccupants}/{room.maxOccupants}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rent</p>
                    <p className="font-semibold">₦{room.yearlyRent.toLocaleString()}</p>
                  </div>

                  {room.availableSpace > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="text-sm font-medium">
                        {room.availableSpace} space{room.availableSpace > 1 ? 's' : ''} available
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Room Features */}
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                {room.hasPrivateBath && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Private Bath
                  </span>
                )}
                {room.hasKitchen && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Kitchen
                  </span>
                )}
                {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                  <span className="text-gray-500">
                    +{room.amenities.length} amenities
                  </span>
                )}
              </div>

              {/* Current Occupants */}
              {room.currentOccupants > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Occupants:</p>
                  <div className="space-y-1">
                    {/* This would need to be populated from the occupants data */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {room.currentOccupants} occupant{room.currentOccupants > 1 ? 's' : ''} assigned
                      </span>
                      {room.availableSpace === 0 && (
                        <span className="text-red-600 font-medium">Room Full</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal would go here */}
      {showAssignmentModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Assign Tenant to {selectedRoom.roomIdentifier}
            </h3>
            <p className="text-gray-600 mb-4">
              This room has {selectedRoom.availableSpace} space{selectedRoom.availableSpace > 1 ? 's' : ''} available.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // This would open the AddOccupantModal with the selected room
                  setShowAssignmentModal(false)
                  // Trigger occupant creation flow
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}