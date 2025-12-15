'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Plus, X, Upload, Camera, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { getPropertyTypes } from '@/lib/propertyTypes'
import { useActivity } from '@/lib/contexts/ActivityContext'
import { useCreateProperty } from '@/lib/hooks/useProperties'
import { Property } from '@/types'

export default function AddOnCampusPropertyPage() {
  const router = useRouter()
  const { addActivity } = useActivity()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const createProperty = useCreateProperty((name) => {
    addActivity('added', 'property', `Added on-campus property: ${name}`)
  })
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'lodge',
    numberOfRooms: '',
    numberOfBathrooms: '',
    numberOfKitchens: '',
    waterAvailability: '',
    yearlyRent: '',
    description: '',
    amenities: [] as string[],
    images: [] as string[],
  })
  const [newAmenity, setNewAmenity] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const types = await getPropertyTypes()
        setPropertyTypes(types)
      } catch (error) {
        console.error('Failed to load property types:', error)
      }
    }
    loadPropertyTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Property name is required')
      }
      if (!formData.address.trim()) {
        throw new Error('Property address is required')
      }
      if (!formData.yearlyRent || parseInt(formData.yearlyRent) <= 0) {
        throw new Error('Valid yearly rent is required')
      }
      if (!formData.numberOfRooms || parseInt(formData.numberOfRooms) <= 0) {
        throw new Error('Number of rooms must be greater than 0')
      }
      if (!formData.numberOfBathrooms || parseInt(formData.numberOfBathrooms) <= 0) {
        throw new Error('Number of bathrooms must be greater than 0')
      }
      if (!formData.numberOfKitchens || parseInt(formData.numberOfKitchens) <= 0) {
        throw new Error('Number of kitchens must be greater than 0')
      }
      if (!formData.waterAvailability) {
        throw new Error('Water availability is required')
      }

      // Create new property object
      const newProperty: Omit<Property, 'id'> = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        type: formData.type as Property['type'],
        status: 'available',
        yearlyRent: parseInt(formData.yearlyRent),
        numberOfRooms: parseInt(formData.numberOfRooms),
        numberOfBathrooms: parseInt(formData.numberOfBathrooms),
        numberOfKitchens: parseInt(formData.numberOfKitchens),
        waterAvailability: formData.waterAvailability as 'in-building' | 'in-compound',
        bedrooms: 0, // Not used for on-campus
        bathrooms: parseInt(formData.numberOfBathrooms),
        area: 0, // Not used for on-campus
        description: formData.description.trim(),
        amenities: formData.amenities.filter(a => a.trim()), // Remove empty amenities
        images: formData.images.length > 0 ? formData.images : ['/realestate1.jpeg'],
        yearBuilt: new Date().getFullYear(),
        parkingSpaces: 'yes',
      }

      console.log('Submitting property:', newProperty)
      await createProperty.mutateAsync(newProperty)
      
      // Success - redirect to properties page
      router.push('/dashboard/properties')
    } catch (error: any) {
      console.error('Error creating property:', error)
      
      // Set user-friendly error message
      let errorMessage = 'Failed to create property. Please try again.'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.details) {
        errorMessage = `Server error: ${error.response.data.details}`
      }
      
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
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
              Property Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Upload className="w-5 h-5" />
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('capture', 'environment')
                      fileInputRef.current.click()
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload property images or take photos using your camera
              </p>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Kitchens *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.numberOfKitchens}
                onChange={(e) => setFormData({ ...formData, numberOfKitchens: e.target.value })}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Availability *
              </label>
              <select
                required
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select water availability</option>
                <option value="in-building">In-Building Water Supply</option>
                <option value="in-compound">In-Compound Water Supply</option>
              </select>
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

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Error Creating Property</p>
              </div>
              <p className="text-red-700 text-sm mt-1">{submitError}</p>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-red-600 text-sm underline mt-2 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/dashboard/properties')}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create On-Campus Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
