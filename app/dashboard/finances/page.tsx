'use client'

import { useRouter } from 'next/navigation'
import { Building2, Home } from 'lucide-react'
import { useProperties } from '@/lib/hooks/useProperties'
import { useRooms } from '@/lib/hooks/useRooms'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function FinancesPage() {
  const router = useRouter()
  const { data: properties = [], isLoading: propertiesLoading } = useProperties()
  const { data: rooms = [], isLoading: roomsLoading } = useRooms()

  if (propertiesLoading || roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  const onCampusRevenue = rooms
    .filter((room: any) => properties.find((p: any) => p.id === room.propertyId)?.type === 'lodge')
    .reduce((sum: number, room: any) => sum + room.occupants.reduce((s: number, occ: any) => s + occ.amountPaid, 0), 0)
  
  const offCampusRevenue = rooms
    .filter((room: any) => properties.find((p: any) => p.id === room.propertyId)?.type !== 'lodge')
    .reduce((sum: number, room: any) => sum + room.occupants.reduce((s: number, occ: any) => s + occ.amountPaid, 0), 0)



  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">FINANCES</h1>
        <p className="text-gray-600">Choose a category to view financial details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => router.push('/dashboard/finances/on-campus')}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-8 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-3">On-Campus Finances</h3>
          <p className="text-green-700 text-sm mb-4">Financial overview for on-campus properties</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-green-900">
              ₦{onCampusRevenue.toLocaleString()}
            </span>
            <span className="text-sm text-green-600 font-medium">Revenue</span>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/finances/off-campus')}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 p-8 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Home className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900 mb-3">Off-Campus Finances</h3>
          <p className="text-purple-700 text-sm mb-4">Financial overview for off-campus properties</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-purple-900">
              ₦{offCampusRevenue.toLocaleString()}
            </span>
            <span className="text-sm text-purple-600 font-medium">Revenue</span>
          </div>
        </div>
      </div>


    </div>
  )
}
