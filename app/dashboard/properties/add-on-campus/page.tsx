'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useActivity } from '@/lib/contexts/ActivityContext'

export default function AddOnCampusPropertyPage() {
  const router = useRouter()
  const { addActivity } = useActivity()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    numberOfRooms: '',
    numberOfBathrooms: '',
    yearlyRent: '',
    description: '',
    amenities: [] as string[],
  })
  const [newAmenity, setNewAmenity] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('On-Campus Property Data:', formData)
    
    // Log activity and show notification
    addActivity('added', 'property', `Added on-campus property: ${formData.name}`)
    
    router.push('/dashboard/properties')
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      })
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add On-Campus Property</h1>
            <p className="text-gray-600">Create a new on-campus student accommodation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ikechukwu Lodge"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Along Holy Trinity Catholic Church, Hilltop, Nsukka"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Image
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                // Handle image upload
                console.log('Images:', e.target.files)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Upload property images (multiple files allowed)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rooms *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.numberOfRooms}
                onChange={(e) => setFormData({ ...formData, numberOfRooms: e.target.value })}
                placeholder="e.g., 20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Bathrooms *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.numberOfBathrooms}
                onChange={(e) => setFormData({ ...formData, numberOfBathrooms: e.target.value })}
                placeholder="e.g., 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yearly Rent (₦) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.yearlyRent}
              onChange={(e) => setFormData({ ...formData, yearlyRent: e.target.value })}
              placeholder="e.g., 500000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the property, facilities, and features..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="e.g., WiFi, Study Room, Laundry"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
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
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/dashboard/properties')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create On-Campus Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
