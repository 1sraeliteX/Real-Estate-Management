'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, MapPin, Bed, Bath, Square, Search, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import { Property } from '@/types'
import { useRouter } from 'next/navigation'
import { useActivity } from '@/lib/contexts/ActivityContext'
import { useProperties, useDeleteProperty } from '@/lib/hooks/useProperties'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function OffCampusPropertiesPage() {
  const router = useRouter()
  const { addActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  
  const { data: allProperties = [], isLoading } = useProperties()
  const deleteProperty = useDeleteProperty((name) => {
    addActivity('deleted', 'property', `Deleted property: ${name}`)
  })

  const properties = allProperties.filter((p: any) => p.type !== 'lodge')

  const filteredProperties = properties.filter((property: any) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    const matchesType = typeFilter === 'all' || property.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: properties.length,
    available: properties.filter((p: any) => p.status === 'available').length,
    occupied: properties.filter((p: any) => p.status === 'occupied').length,
    maintenance: properties.filter((p: any) => p.status === 'maintenance').length
  }

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty.mutateAsync(propertyId)
      } catch (error) {
        console.error('Error deleting property:', error)
        alert('Failed to delete property. Please try again.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <button
        onClick={() => router.push('/dashboard/properties')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Properties
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Off-Campus Properties</h1>
          <p className="text-gray-600">Independent apartments and houses for students</p>
        </div>
        <Link
          href="/dashboard/properties/add-off-campus"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard title="Total Properties" value={stats.total} icon={Home} color="purple" />
        <StatsCard title="Available" value={stats.available} icon={Home} color="green" />
        <StatsCard title="Occupied" value={stats.occupied} icon={Home} color="blue" />
        <StatsCard title="Maintenance" value={stats.maintenance} icon={Home} color="yellow" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new property</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProperties.map((property: any) => (
            <div
              key={property.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all duration-300"
            >
              <Link href={`/dashboard/properties/${property.id}`}>
                <div className="relative h-56 cursor-pointer overflow-hidden">
                  <img
                    src={property.images[0] as string}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm capitalize">
                    {property.type}
                  </span>
                </div>
              </Link>

              <div className="p-5">
                <Link href={`/dashboard/properties/${property.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 cursor-pointer group-hover:text-purple-600 transition-colors line-clamp-1">
                    {property.name}
                  </h3>
                </Link>

                <div className="flex items-start gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span className="text-sm leading-relaxed line-clamp-2">{property.address}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-700 mb-5 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 bg-purple-100 rounded-md">
                      <Bed className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 bg-purple-100 rounded-md">
                      <Bath className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 bg-purple-100 rounded-md">
                      <Square className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{property.area}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-4 border-t border-gray-200 mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₦{property.yearlyRent.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">/year</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Edit property ${property.name}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
