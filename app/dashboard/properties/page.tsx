'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Home } from 'lucide-react'
import { useProperties } from '@/lib/hooks/useProperties'
import LoadingSpinner from '@/components/LoadingSpinner'
import { migratePropertiesData } from '@/lib/utils/migrateProperties'

export default function PropertiesPage() {
  const router = useRouter()
  const { data: properties = [], isLoading } = useProperties()

  useEffect(() => {
    // Migrate old properties data on first load
    migratePropertiesData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  
  const onCampusProperties = properties.filter((p: any) => p.type === 'lodge')
  const offCampusProperties = properties.filter((p: any) => p.type !== 'lodge')
  
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">🏠 MY PROPERTIES</h1>
        <p className="text-gray-600 text-xl">Choose which type of properties you want to see</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => router.push('/dashboard/properties/on-campus')}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-3 border-blue-300 p-10 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <Building2 className="w-16 h-16 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-blue-900 mb-4">🏫 On-Campus Properties</h3>
          <p className="text-blue-700 text-lg mb-6">Properties located on campus</p>
          <div className="flex items-center justify-between">
            <span className="text-6xl font-bold text-blue-900">
              {onCampusProperties.length}
            </span>
            <span className="text-lg text-blue-600 font-semibold">Properties</span>
          </div>
        </button>

        <button 
          onClick={() => router.push('/dashboard/properties/off-campus')}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-3 border-purple-300 p-10 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <Home className="w-16 h-16 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-purple-900 mb-4">🏘️ Off-Campus Properties</h3>
          <p className="text-purple-700 text-lg mb-6">Properties located off campus</p>
          <div className="flex items-center justify-between">
            <span className="text-6xl font-bold text-purple-900">
              {offCampusProperties.length}
            </span>
            <span className="text-lg text-purple-600 font-semibold">Properties</span>
          </div>
        </button>
      </div>
    </div>
  )
}


