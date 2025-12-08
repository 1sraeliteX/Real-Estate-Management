'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Room } from '@/types'

interface AddRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (room: Omit<Room, 'id'>) => void
  propertyId: string
  propertyName: string
  onAddOccupant?: () => void
}

export default function AddRoomModal({ isOpen, onClose, onAdd, propertyId, propertyName, onAddOccupant }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    yearlyRent: '',
  })
  const [showAddOccupantButton, setShowAddOccupantButton] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRoom: Omit<Room, 'id'> = {
      propertyId,
      propertyName,
      roomNumber: formData.roomNumber,
      status: 'available',
      occupants: [],
      yearlyRent: parseFloat(formData.yearlyRent),
    }

    onAdd(newRoom)
    setFormData({ roomNumber: '', yearlyRent: '' })
    setShowAddOccupantButton(true)
  }

  const handleClose = () => {
    setShowAddOccupantButton(false)
    onClose()
  }

  const handleAddOccupantClick = () => {
    setShowAddOccupantButton(false)
    onClose()
    if (onAddOccupant) {
      onAddOccupant()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{showAddOccupantButton ? 'Room Added!' : 'Add New Room'}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {showAddOccupantButton ? (
          <div className="p-6 space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Room added successfully!</h3>
              <p className="text-gray-600 mb-6">Would you like to add an occupant to this room?</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleAddOccupantClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Occupant
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
              <input
                type="text"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 101, A1, Room 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Rent (₦) *</label>
              <input
                type="number"
                name="yearlyRent"
                required
                value={formData.yearlyRent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500,000"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Room
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
