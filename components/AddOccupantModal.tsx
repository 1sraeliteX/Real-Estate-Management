'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { RoomOccupant } from '@/types'

interface AddOccupantModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (occupant: Omit<RoomOccupant, 'id'>) => void
  roomId: string
  availableRooms?: Array<{ id: string; roomNumber: string; yearlyRent: number }>
  showRoomSelector?: boolean
}

export default function AddOccupantModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  roomId: initialRoomId, 
  availableRooms = [],
  showRoomSelector = false 
}: AddOccupantModalProps) {
  const [formData, setFormData] = useState({
    roomId: initialRoomId,
    name: '',
    phone: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    numberOfOccupants: '1',
    kitchenAccess: '',
    rentStartDate: '',
    rentExpiryDate: '',
    totalRent: '',
    amountPaid: '',
    paymentDate: '',
    paymentProof: null as File | null,
  })

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setFormData({ ...formData, paymentProof: file })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const totalRent = parseFloat(formData.totalRent)
    const amountPaid = parseFloat(formData.amountPaid)
    const roomIdToUse = showRoomSelector ? formData.roomId : initialRoomId
    
    const newOccupant: Omit<RoomOccupant, 'id'> = {
      roomId: roomIdToUse,
      name: formData.name,
      phone: formData.phone,
      nextOfKin: formData.nextOfKin,
      nextOfKinPhone: formData.nextOfKinPhone,
      numberOfOccupants: parseInt(formData.numberOfOccupants),
      kitchenAccess: formData.kitchenAccess as 'shared' | 'private' | 'none',
      rentStartDate: formData.rentStartDate,
      rentExpiryDate: formData.rentExpiryDate,
      totalRent,
      amountPaid,
      paymentStatus: amountPaid >= totalRent ? 'completed' : 'pending',
      issues: [],
      notes: []
    }

    onAdd(newOccupant)
    setFormData({
      roomId: initialRoomId,
      name: '',
      phone: '',
      nextOfKin: '',
      nextOfKinPhone: '',
      numberOfOccupants: '1',
      kitchenAccess: '',
      rentStartDate: '',
      rentExpiryDate: '',
      totalRent: '',
      amountPaid: '',
      paymentDate: '',
      paymentProof: null,
    })
    onClose()
  }

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoom = availableRooms.find(r => r.id === e.target.value)
    setFormData({ 
      ...formData, 
      roomId: e.target.value,
      totalRent: selectedRoom ? selectedRoom.yearlyRent.toString() : formData.totalRent
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">👤 Add New Tenant</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the tenant's information below</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {showRoomSelector && availableRooms.length > 0 && (
              <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-base font-bold text-gray-900 mb-2">🏠 Which Room? *</label>
                <select
                  value={formData.roomId}
                  onChange={handleRoomChange}
                  required
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a room...</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} - ₦{room.yearlyRent.toLocaleString()}/year
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">👤 Tenant's Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">📱 Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 08012345678"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">👨‍👩‍👧 Emergency Contact Name *</label>
              <input
                type="text"
                name="nextOfKin"
                required
                value={formData.nextOfKin}
                onChange={handleInputChange}
                placeholder="e.g., Jane Doe (Mother)"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">Person to call in case of emergency</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">📞 Emergency Contact Phone *</label>
              <input
                type="tel"
                name="nextOfKinPhone"
                required
                value={formData.nextOfKinPhone}
                onChange={handleInputChange}
                placeholder="e.g., 08098765432"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">👥 How Many People? *</label>
              <input
                type="number"
                name="numberOfOccupants"
                required
                min="1"
                value={formData.numberOfOccupants}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">Total number of people living in this room</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">🍳 Kitchen Access *</label>
              <select
                name="kitchenAccess"
                required
                value={formData.kitchenAccess}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose kitchen access...</option>
                <option value="shared">Shared Kitchen</option>
                <option value="private">Private Kitchen</option>
                <option value="none">No Kitchen Access</option>
              </select>
              <p className="mt-1 text-sm text-gray-600">Type of kitchen access for this occupant</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">📅 When Did They Move In? *</label>
              <input
                type="date"
                name="rentStartDate"
                required
                value={formData.rentStartDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">📅 When Will Rent Expire? *</label>
              <input
                type="date"
                name="rentExpiryDate"
                required
                value={formData.rentExpiryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">💰 Total Rent Amount (₦) *</label>
              <input
                type="number"
                name="totalRent"
                required
                value={formData.totalRent}
                onChange={handleInputChange}
                placeholder="e.g., 500000"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">How much they should pay in total</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">✅ Amount Already Paid (₦) *</label>
              <input
                type="number"
                name="amountPaid"
                required
                value={formData.amountPaid}
                onChange={handleInputChange}
                placeholder="e.g., 500000"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">How much they have paid so far</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">📅 When Did They Pay?</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">Optional - date of payment</p>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-base font-bold text-gray-900 mb-2">📄 Upload Payment Receipt (Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p className="mt-2 text-sm text-gray-600">You can upload a photo of the receipt or bank transfer</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-lg"
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg hover:shadow-xl"
            >
              ✅ Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
