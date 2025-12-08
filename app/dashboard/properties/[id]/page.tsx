'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Building2, MapPin, Phone, MessageCircle, Plus, Check, X, FileText, Download, Edit2, Trash2 } from 'lucide-react'
import AddRoomModal from '@/components/AddRoomModal'
import AddOccupantModal from '@/components/AddOccupantModal'
import { Room, RoomOccupant, Issue, Note } from '@/types'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = params.id as string
  
  const [activeTab, setActiveTab] = useState<'rooms' | 'occupants' | 'finance' | 'maintenance'>('rooms')
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['rooms', 'occupants', 'finance', 'maintenance'].includes(tab)) {
      setActiveTab(tab as 'rooms' | 'occupants' | 'finance' | 'maintenance')
    }
  }, [searchParams])
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [isOccupantModalOpen, setIsOccupantModalOpen] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [newIssue, setNewIssue] = useState('')
  const [newNote, setNewNote] = useState('')
  const [maintenanceNote, setMaintenanceNote] = useState('')

  // Load property and rooms from mockApi
  const { mockProperties, mockRooms, mockMaintenanceRequests } = 
    typeof window !== 'undefined' ? require('@/lib/mockApi') : { mockProperties: [], mockRooms: [], mockMaintenanceRequests: [] }
  
  const property = mockProperties.find((p: any) => p.id === propertyId)
  const [rooms, setRooms] = useState<Room[]>(
    mockRooms.filter((r: Room) => r.propertyId === propertyId)
  )
  
  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleAddRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
    }
    setRooms([...rooms, newRoom])
  }

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      setRooms(rooms.filter(room => room.id !== roomId))
    }
  }

  const handleDeleteOccupant = (roomId: string, occupantId: string) => {
    if (confirm('Are you sure you want to remove this occupant?')) {
      setRooms(rooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              occupants: room.occupants.filter(occ => occ.id !== occupantId),
              status: room.occupants.filter(occ => occ.id !== occupantId).length === 0 ? 'available' as const : room.status
            }
          : room
      ))
    }
  }

  const handleAddOccupant = (occupant: Omit<RoomOccupant, 'id'>) => {
    const newOccupant: RoomOccupant = {
      ...occupant,
      id: Date.now().toString(),
    }
    
    setRooms(rooms.map(room => 
      room.id === selectedRoomId
        ? { ...room, occupants: [...room.occupants, newOccupant], status: 'occupied' as const }
        : room
    ))
  }

  const handleAddIssue = (occupantId: string, roomId: string) => {
    if (!newIssue.trim()) return
    
    const issue: Issue = {
      id: Date.now().toString(),
      description: newIssue,
      resolved: false,
      createdAt: new Date().toISOString(),
    }
    
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            occupants: room.occupants.map(occ =>
              occ.id === occupantId
                ? { ...occ, issues: [...occ.issues, issue] }
                : occ
            )
          }
        : room
    ))
    setNewIssue('')
  }

  const toggleIssueResolved = (occupantId: string, roomId: string, issueId: string) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            occupants: room.occupants.map(occ =>
              occ.id === occupantId
                ? {
                    ...occ,
                    issues: occ.issues.map(issue =>
                      issue.id === issueId
                        ? { ...issue, resolved: !issue.resolved, resolvedAt: !issue.resolved ? new Date().toISOString() : undefined }
                        : issue
                    )
                  }
                : occ
            )
          }
        : room
    ))
  }

  const handleAddNote = (occupantId: string, roomId: string) => {
    if (!newNote.trim()) return
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
    }
    
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            occupants: room.occupants.map(occ =>
              occ.id === occupantId
                ? { ...occ, notes: [...occ.notes, note] }
                : occ
            )
          }
        : room
    ))
    setNewNote('')
  }

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const exportToCSV = () => {
    const allOccupants = rooms.flatMap(room =>
      room.occupants.map(occ => ({
        Room: room.roomNumber,
        Name: occ.name,
        Phone: occ.phone,
        'Next of Kin': occ.nextOfKin,
        'Next of Kin Phone': occ.nextOfKinPhone,
        'Number of Occupants': occ.numberOfOccupants,
        'Rent Start': occ.rentStartDate,
        'Rent Expiry': occ.rentExpiryDate,
        'Total Rent': occ.totalRent,
        'Amount Paid': occ.amountPaid,
        'Payment Status': occ.paymentStatus,
      }))
    )
    
    const csv = [
      Object.keys(allOccupants[0] || {}).join(','),
      ...allOccupants.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${property.name}-occupants.csv`
    a.click()
  }

  const getPaymentStatusBadge = (occupant: RoomOccupant) => {
    const balance = occupant.totalRent - occupant.amountPaid
    if (occupant.paymentStatus === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Completed</span>
    }
    return (
      <div className="flex flex-col gap-1">
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Pending</span>
        <span className="text-xs text-red-600 font-medium">Balance: ₦{balance.toLocaleString()}</span>
      </div>
    )
  }

  const allOccupants = rooms.flatMap(room =>
    room.occupants.map(occ => ({ ...occ, roomNumber: room.roomNumber, roomId: room.id }))
  )

  const totalFinance = allOccupants.reduce((sum, occ) => sum + occ.amountPaid, 0)
  const totalExpected = allOccupants.reduce((sum, occ) => sum + occ.totalRent, 0)
  const totalPending = totalExpected - totalFinance

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Properties
      </button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        {/* Property Image */}
        {property.images && property.images.length > 0 && (
          <div className="relative h-64 md:h-80 w-full">
            <img
              src={typeof property.images[0] === 'string' ? property.images[0] : URL.createObjectURL(property.images[0])}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {(!property.images || property.images.length === 0) && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                {property.type === 'lodge' && (
                  <>
                    <div>
                      <span className="text-gray-500">Rooms:</span>
                      <span className="ml-2 font-semibold">{property.numberOfRooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Kitchens:</span>
                      <span className="ml-2 font-semibold">{property.numberOfKitchens}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bathrooms:</span>
                      <span className="ml-2 font-semibold">{property.numberOfBathrooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Water:</span>
                      <span className="ml-2 font-semibold capitalize">{property.waterAvailability}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Parking:</span>
                      <span className="ml-2 font-semibold">{property.parkingSpaces}</span>
                    </div>
                  </>
                )}
                {property.type !== 'lodge' && (
                  <>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-semibold capitalize">{property.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bedrooms:</span>
                      <span className="ml-2 font-semibold">{property.bedrooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bathrooms:</span>
                      <span className="ml-2 font-semibold">{property.bathrooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <span className="ml-2 font-semibold">{property.area} sq ft</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-semibold capitalize">{property.status}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'rooms', label: 'Rooms' },
              { key: 'occupants', label: 'Occupants' },
              { key: 'finance', label: 'Finance' },
              { key: 'maintenance', label: 'Maintenance' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Rooms</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {rooms.length} rooms | Occupied: {rooms.filter(r => r.status === 'occupied').length} | Available: {rooms.filter(r => r.status === 'available').length}
                  </p>
                </div>
                <button
                  onClick={() => setIsRoomModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              {rooms.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rooms Yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding rooms to this property</p>
                  <button
                    onClick={() => setIsRoomModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Room
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rooms.map((room) => {
                  const roomPaymentStatus = room.occupants.length > 0 
                    ? room.occupants.every(occ => occ.paymentStatus === 'completed') 
                      ? 'completed' 
                      : 'pending'
                    : null
                  
                  return (
                    <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Room Header */}
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">Room {room.roomNumber}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              room.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {room.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm mb-3">
                          <span className="text-gray-500">Yearly Rent:</span>
                          <span className="ml-2 font-semibold text-gray-900">₦{room.yearlyRent.toLocaleString()}</span>
                        </div>
                        <div className="text-sm mb-3">
                          <span className="text-gray-500">Occupants:</span>
                          <span className="ml-2 font-semibold text-gray-900">{room.occupants.length}</span>
                        </div>
                        
                        {/* Payment Status Tag */}
                        {roomPaymentStatus && (
                          <div className="mb-3">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              roomPaymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {roomPaymentStatus === 'completed' ? '✓ Payment Complete' : '⏳ Pending Payment'}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert(`Edit room ${room.roomNumber}`)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                            title="Edit room"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                            title="Delete room"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Occupants Tab */}
          {activeTab === 'occupants' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Occupants</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total Occupants: {allOccupants.length}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRoomId('')
                    setIsOccupantModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Occupant
                </button>
              </div>

              {allOccupants.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Occupants Yet</h3>
                  <p className="text-gray-600 mb-4">Add rooms first, then add occupants to those rooms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allOccupants.map((occupant) => {
                    const rentRemaining = occupant.totalRent - occupant.amountPaid
                    const hasRentRemaining = rentRemaining > 0
                    
                    return (
                      <div key={occupant.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Occupant Header */}
                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{occupant.name}</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                              Room {occupant.roomNumber}
                            </span>
                          </div>
                        </div>

                        {/* Occupant Details */}
                        <div className="p-4">
                          <div className="space-y-3">
                            {/* Rent Remaining Alert */}
                            {hasRentRemaining && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-semibold text-red-800">Rent Remaining</span>
                                </div>
                                <p className="text-lg font-bold text-red-900">₦{rentRemaining.toLocaleString()}</p>
                                <p className="text-xs text-red-700 mt-1">
                                  Paid: ₦{occupant.amountPaid.toLocaleString()} of ₦{occupant.totalRent.toLocaleString()}
                                </p>
                              </div>
                            )}

                            {/* Occupant Info */}
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span className="font-medium text-gray-900">{occupant.phone}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Next of Kin:</span>
                                <span className="font-medium text-gray-900">{occupant.nextOfKin}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Next of Kin Phone:</span>
                                <span className="font-medium text-gray-900">{occupant.nextOfKinPhone}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Persons:</span>
                                <span className="font-medium text-gray-900">{occupant.numberOfOccupants}</span>
                              </div>
                              <div className="pt-2 border-t border-gray-100">
                                <div className="text-xs text-gray-500 mb-1">Rent Period</div>
                                <div className="text-xs">
                                  {occupant.rentStartDate} to {occupant.rentExpiryDate}
                                </div>
                              </div>
                            </div>

                            {/* Payment Status */}
                            <div className="pt-3 border-t border-gray-100">
                              {getPaymentStatusBadge(occupant)}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleWhatsApp(occupant.phone)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-green-600 border border-green-600 rounded hover:bg-green-50"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleCall(occupant.phone)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                title="Call"
                              >
                                <Phone className="w-3 h-3" />
                                Call
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => alert(`Edit occupant ${occupant.name}`)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteOccupant(occupant.roomId, occupant.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Finance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Total Collected</h3>
                  <p className="text-2xl font-bold text-green-900">₦{totalFinance.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Total Expected</h3>
                  <p className="text-2xl font-bold text-blue-900">₦{totalExpected.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Total Pending</h3>
                  <p className="text-2xl font-bold text-red-900">₦{totalPending.toLocaleString()}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Rent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allOccupants.map((occupant) => (
                      <tr key={occupant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{occupant.roomNumber}</td>
                        <td className="px-4 py-3 text-sm">{occupant.name}</td>
                        <td className="px-4 py-3 text-sm font-semibold">₦{occupant.totalRent.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-semibold">₦{occupant.amountPaid.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                          ₦{(occupant.totalRent - occupant.amountPaid).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{getPaymentStatusBadge(occupant)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Maintenance Requests</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <textarea
                  value={maintenanceNote}
                  onChange={(e) => setMaintenanceNote(e.target.value)}
                  placeholder="Add maintenance notes, repairs, or important information..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    if (maintenanceNote.trim()) {
                      alert('Note saved!')
                      setMaintenanceNote('')
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Note
                </button>
              </div>

              <div className="space-y-3">
                {mockMaintenanceRequests
                  .filter((req: any) => req.propertyId === propertyId)
                  .map((request: any) => (
                    <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{request.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Category: <span className="font-medium capitalize">{request.category}</span></span>
                            <span>Priority: <span className="font-medium capitalize">{request.priority}</span></span>
                            <span>Reported: {request.reportedDate}</span>
                            {request.assignedTo && <span>Assigned to: {request.assignedTo}</span>}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Estimated Cost:</span>
                            <span className="ml-2 font-semibold">₦{request.estimatedCost.toLocaleString()}</span>
                            {request.actualCost && (
                              <>
                                <span className="ml-4 text-gray-500">Actual Cost:</span>
                                <span className="ml-2 font-semibold">₦{request.actualCost.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                
                {mockMaintenanceRequests.filter((req: any) => req.propertyId === propertyId).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No maintenance requests for this property
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onAdd={handleAddRoom}
        propertyId={property.id}
        propertyName={property.name}
        onAddOccupant={() => {
          setSelectedRoomId('')
          setIsOccupantModalOpen(true)
        }}
      />

      <AddOccupantModal
        isOpen={isOccupantModalOpen}
        onClose={() => setIsOccupantModalOpen(false)}
        onAdd={handleAddOccupant}
        roomId={selectedRoomId}
        availableRooms={rooms.filter(r => r.status === 'available').map(r => ({
          id: r.id,
          roomNumber: r.roomNumber,
          yearlyRent: r.yearlyRent
        }))}
        showRoomSelector={!selectedRoomId}
      />
    </div>
  )
}
