'use client'

import { useState } from 'react'
import { Plus, X, Edit2, Trash2, Home, Users, DollarSign } from 'lucide-react'

interface RoomData {
  id?: string
  roomPrefix: string
  roomNumber: string
  roomType: 'single' | 'shared' | 'studio' | 'apartment'
  maxOccupants: number
  yearlyRent: number
  floor?: number
  size?: number
  hasPrivateBath: boolean
  hasKitchen: boolean
  amenities: string[]
}

interface RoomManagementProps {
  rooms: RoomData[]
  onRoomsChange: (rooms: RoomData[]) => void
  propertyType: string
  disabled?: boolean
}

export default function RoomManagement({ 
  rooms, 
  onRoomsChange, 
  propertyType,
  disabled = false 
}: RoomManagementProps) {
  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null)
  const [newRoom, setNewRoom] = useState<RoomData>({
    roomPrefix: propertyType === 'lodge' ? 'R' : 'APT',
    roomNumber: '',
    roomType: 'single',
    maxOccupants: 1,
    yearlyRent: 0,
    floor: 1,
    size: 0,
    hasPrivateBath: false,
    hasKitchen: false,
    amenities: []
  })
  const [newAmenity, setNewAmenity] = useState('')

  const roomTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'apartment', label: 'Apartment' }
  ]

  const commonAmenities = [
    'Air Conditioning', 'WiFi', 'Study Desk', 'Wardrobe', 'Bed', 'Chair',
    'Window', 'Fan', 'Power Outlets', 'Reading Light', 'Storage Space'
  ]

  const handleAddRoom = () => {
    if (!newRoom.roomNumber.trim()) {
      alert('Room number is required')
      return
    }

    // Check for duplicate room identifiers
    const roomIdentifier = `${newRoom.roomPrefix}-${newRoom.roomNumber}`
    const isDuplicate = rooms.some(room => 
      `${room.roomPrefix}-${room.roomNumber}` === roomIdentifier
    )

    if (isDuplicate) {
      alert(`Room ${roomIdentifier} already exists. Please use a different room number.`)
      return
    }

    const roomToAdd = { ...newRoom }
    onRoomsChange([...rooms, roomToAdd])
    
    // Reset form
    setNewRoom({
      roomPrefix: propertyType === 'lodge' ? 'R' : 'APT',
      roomNumber: '',
      roomType: 'single',
      maxOccupants: 1,
      yearlyRent: 0,
      floor: 1,
      size: 0,
      hasPrivateBath: false,
      hasKitchen: false,
      amenities: []
    })
    setIsAddingRoom(false)
  }

  const handleEditRoom = (index: number) => {
    setEditingRoomIndex(index)
    setNewRoom({ ...rooms[index] })
    setIsAddingRoom(true)
  }

  const handleUpdateRoom = () => {
    if (editingRoomIndex === null) return
    
    if (!newRoom.roomNumber.trim()) {
      alert('Room number is required')
      return
    }

    // Check for duplicate room identifiers (excluding current room)
    const roomIdentifier = `${newRoom.roomPrefix}-${newRoom.roomNumber}`
    const isDuplicate = rooms.some((room, index) => 
      index !== editingRoomIndex && `${room.roomPrefix}-${room.roomNumber}` === roomIdentifier
    )

    if (isDuplicate) {
      alert(`Room ${roomIdentifier} already exists. Please use a different room number.`)
      return
    }

    const updatedRooms = [...rooms]
    updatedRooms[editingRoomIndex] = { ...newRoom }
    onRoomsChange(updatedRooms)
    
    // Reset form
    setNewRoom({
      roomPrefix: propertyType === 'lodge' ? 'R' : 'APT',
      roomNumber: '',
      roomType: 'single',
      maxOccupants: 1,
      yearlyRent: 0,
      floor: 1,
      size: 0,
      hasPrivateBath: false,
      hasKitchen: false,
      amenities: []
    })
    setIsAddingRoom(false)
    setEditingRoomIndex(null)
  }

  const handleDeleteRoom = (index: number) => {
    if (confirm('Are you sure you want to delete this room?')) {
      const updatedRooms = rooms.filter((_, i) => i !== index)
      onRoomsChange(updatedRooms)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !newRoom.amenities.includes(newAmenity.trim())) {
      setNewRoom({
        ...newRoom,
        amenities: [...newRoom.amenities, newAmenity.trim()]
      })
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenityIndex: number) => {
    setNewRoom({
      ...newRoom,
      amenities: newRoom.amenities.filter((_, i) => i !== amenityIndex)
    })
  }

  const addCommonAmenity = (amenity: string) => {
    if (!newRoom.amenities.includes(amenity)) {
      setNewRoom({
        ...newRoom,
        amenities: [...newRoom.amenities, amenity]
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Room Configuration</h3>
          <p className="text-sm text-gray-600">Define individual rooms for this property</p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => setIsAddingRoom(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        )}
      </div>

      {/* Room List */}
      {rooms.length > 0 && (
        <div className="grid gap-4">
          {rooms.map((room, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-lg">
                      {room.roomPrefix}-{room.roomNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Max {room.maxOccupants} occupant{room.maxOccupants > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>₦{room.yearlyRent.toLocaleString()}/year</span>
                  </div>
                </div>
                {!disabled && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditRoom(index)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(index)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-1 capitalize">{room.roomType}</span>
                </div>
                {room.floor && (
                  <div>
                    <span className="text-gray-500">Floor:</span>
                    <span className="ml-1">{room.floor}</span>
                  </div>
                )}
                {room.size && (
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-1">{room.size}m²</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Private Bath:</span>
                  <span className="ml-1">{room.hasPrivateBath ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {room.amenities.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm text-gray-500">Amenities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.amenities.map((amenity, amenityIndex) => (
                      <span
                        key={amenityIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Room Form */}
      {isAddingRoom && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">
              {editingRoomIndex !== null ? 'Edit Room' : 'Add New Room'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAddingRoom(false)
                setEditingRoomIndex(null)
                setNewRoom({
                  roomPrefix: propertyType === 'lodge' ? 'R' : 'APT',
                  roomNumber: '',
                  roomType: 'single',
                  maxOccupants: 1,
                  yearlyRent: 0,
                  floor: 1,
                  size: 0,
                  hasPrivateBath: false,
                  hasKitchen: false,
                  amenities: []
                })
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Prefix *
              </label>
              <input
                type="text"
                value={newRoom.roomPrefix}
                onChange={(e) => setNewRoom({ ...newRoom, roomPrefix: e.target.value.toUpperCase() })}
                placeholder="e.g., A, B, RM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                placeholder="e.g., 101, 03"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value as RoomData['roomType'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Occupants *
              </label>
              <input
                type="number"
                min="1"
                value={newRoom.maxOccupants}
                onChange={(e) => setNewRoom({ ...newRoom, maxOccupants: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yearly Rent (₦) *
              </label>
              <input
                type="number"
                min="0"
                value={newRoom.yearlyRent}
                onChange={(e) => setNewRoom({ ...newRoom, yearlyRent: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <input
                type="number"
                min="0"
                value={newRoom.floor || ''}
                onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (m²)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={newRoom.size || ''}
                onChange={(e) => setNewRoom({ ...newRoom, size: parseFloat(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRoom.hasPrivateBath}
                  onChange={(e) => setNewRoom({ ...newRoom, hasPrivateBath: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Private Bathroom</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRoom.hasKitchen}
                  onChange={(e) => setNewRoom({ ...newRoom, hasKitchen: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Kitchen</span>
              </label>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Amenities
            </label>
            
            {/* Quick Add Common Amenities */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {commonAmenities.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => addCommonAmenity(amenity)}
                    disabled={newRoom.amenities.includes(amenity)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amenity Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="Add custom amenity..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Add
              </button>
            </div>

            {/* Selected Amenities */}
            {newRoom.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newRoom.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsAddingRoom(false)
                setEditingRoomIndex(null)
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={editingRoomIndex !== null ? handleUpdateRoom : handleAddRoom}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingRoomIndex !== null ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </div>
      )}

      {rooms.length === 0 && !isAddingRoom && (
        <div className="text-center py-8 text-gray-500">
          <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No rooms defined yet</p>
          <p className="text-sm">Add rooms to enable tenant assignments</p>
        </div>
      )}
    </div>
  )
}