'use client'

import { useRouter } from 'next/navigation'
import { Building2, Home, Sparkles } from 'lucide-react'
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

      {/* Up Next Section */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Real Estate Logo in Golden Rectangle */}
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg p-4 shadow-lg">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-amber-900">Up Next - Cornerstone Pro</h3>
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-amber-800 text-lg font-medium mb-2">
                The Ultimate Property Management Hierarchy
              </p>
              <p className="text-amber-700 text-sm">
                Based on user feedback to make user experience better
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-amber-600 font-medium mb-1">Coming Soon</div>
            <div className="text-xs text-amber-500">Enhanced Features</div>
          </div>
        </div>
      </div>
    </div>
  )
}
