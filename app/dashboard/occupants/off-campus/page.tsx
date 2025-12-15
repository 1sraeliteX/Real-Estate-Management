'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Search, DollarSign, ArrowLeft, Phone, MessageCircle, Trash2, Home, Calendar, ArrowRight } from 'lucide-react'
import AddOccupantModal from '@/components/AddOccupantModal'
import RoomAssignmentModal from '@/components/RoomAssignmentModal'
import { RoomOccupant, Room } from '@/types'
import { useRouter } from 'next/navigation'
import { useCreateOccupant, useDeleteOccupant } from '@/lib/hooks/useOccupants'
import { useProperties } from '@/lib/hooks/useProperties'
import { useRooms } from '@/lib/hooks/useRooms'

export default function OffCampusOccupantsPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [selectedOccupant, setSelectedOccupant] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const { data: properties = [] } = useProperties()
  const { data: rooms = [] } = useRooms()
  const createOccupant = useCreateOccupant()
  const deleteOccupant = useDeleteOccupant()

  // Filter for non-lodge properties (off-campus)
  const offCampusProperties = properties.filter((p: any) => p.type !== 'lodge')
  const offCampusRooms = rooms.filter((room: any) => 
    offCampusProperties.some((p: any) => p.id === room.propertyId)
  )

  // Get all occupants from off-campus rooms
  const occupants = offCampusRooms.flatMap((room: any) => 
    room.occupants?.map((occupant: any) => ({
      ...occupant,
      roomNumber: room.roomNumber,
      propertyName: room.propertyName,
      propertyId: room.propertyId,
      propertyType: offCampusProperties.find((p: any) => p.id === room.propertyId)?.type || 'apartment'
    })) || []
  )

  // Available rooms for new occupants (rooms with available space)
  const availableRooms = offCampusRooms.filter((room: any) => 
    room.status === 'available' || room.currentOccupants < room.maxOccupants
  ).map((room: any) => ({
    ...room,
    availableSpace: room.maxOccupants - room.currentOccupants
  }))

  const filteredOccupants = occupants.filter((occupant: any) => {
    const matchesSearch = occupant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occupant.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occupant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occupant.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProperty = selectedProperty === 'all' || occupant.propertyId === selectedProperty
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || occupant.paymentStatus === selectedPaymentStatus
    
    return matchesSearch && matchesProperty && matchesPaymentStatus
  })

  const handleAddOccupant = async (newOccupant: Omit<RoomOccupant, 'id'>) => {
    try {
      await createOccupant.mutateAsync(newOccupant)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to add occupant:', error)
      alert('Failed to add tenant. Please try again.')
    }
  }

  const handleDeleteOccupant = async (occupantId: string) => {
    if (!confirm('Are you sure you want to remove this occupant?')) return
    try {
      await deleteOccupant.mutateAsync(occupantId)
    } catch (error) {
      console.error('Failed to delete occupant:', error)
      alert('Failed to remove tenant. Please try again.')
    }
  }

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleRoomAssignment = (occupant: any) => {
    setSelectedOccupant(occupant)
    setIsAssignmentModalOpen(true)
  }

  const handleAssignRoom = async (occupantId: string, newRoomId: string) => {
    try {
      const response = await fetch(`/api/occupants/${occupantId}/assign-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRoomId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to assign room')
      }

      const result = await response.json()
      alert(result.message)
      // Refresh the data
      window.location.reload()
    } catch (error) {
      console.error('Room assignment error:', error)
      alert(error instanceof Error ? error.message : 'Failed to assign room')
    }
  }

  const stats = {
    total: filteredOccupants.length,
    pendingPayments: filteredOccupants.filter((o: any) => o.paymentStatus === 'pending').length
  }

  const uniqueProperties = occupants
    .map((o: any) => ({ id: o.propertyId, name: o.propertyName }))
    .filter((property: any, index: number, self: any[]) => 
      index === self.findIndex((p: any) => p.id === property.id)
    )

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <button
        onClick={() => router.push('/dashboard/occupants')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Occupants
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Off-Campus Occupants</h1>
          <p className="text-gray-600">Manage occupants in off-campus properties</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Occupant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Occupants</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search occupants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Properties</option>
            {uniqueProperties.map((property: any) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredOccupants.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No occupants found</p>
          <p className="text-sm text-gray-400 mt-2">Click "Add Occupant" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupant
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Room
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Period
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOccupants.map((occupant: any) => (
                  <tr key={occupant.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold">
                            {occupant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{occupant.name}</div>
                          <div className="text-xs text-gray-500">{occupant.numberOfOccupants} person(s)</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-900">{occupant.propertyName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Room {occupant.roomNumber}
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {occupant.propertyType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {occupant.phone}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleWhatsApp(occupant.phone)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 border border-green-600 rounded hover:bg-green-50"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleCall(occupant.phone)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                          title="Call"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </button>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(occupant.rentStartDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        to {new Date(occupant.rentExpiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{occupant.amountPaid.toLocaleString()} / ₦{occupant.totalRent.toLocaleString()}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        occupant.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {occupant.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRoomAssignment(occupant)}
                          className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded"
                          title="Assign to different room"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOccupant(occupant.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="Remove occupant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddOccupantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOccupant}
        roomId=""
        availableRooms={availableRooms.map((r: any) => ({
          id: r.id,
          roomNumber: r.roomNumber,
          propertyName: r.propertyName,
          yearlyRent: r.yearlyRent,
          maxOccupants: r.maxOccupants,
          currentOccupants: r.currentOccupants,
          availableSpace: r.availableSpace
        }))}
        showRoomSelector={true}
      />

      {selectedOccupant && (
        <RoomAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false)
            setSelectedOccupant(null)
          }}
          occupant={selectedOccupant}
          availableRooms={availableRooms}
          onAssign={handleAssignRoom}
        />
      )}
    </div>
  )
}
