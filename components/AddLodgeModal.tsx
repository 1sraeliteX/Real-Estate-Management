'use client'

import { useState, useRef } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { Property } from '@/types'

interface AddLodgeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (property: Omit<Property, 'id'>) => void
}

export default function AddLodgeModal({ isOpen, onClose, onAdd }: AddLodgeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    numberOfRooms: '',
    numberOfKitchens: '',
    numberOfBathrooms: '',
    waterAvailability: 'in-building' as 'in-building' | 'in-compound',
    parkingSpaces: 'yes' as 'yes' | 'no',
    yearlyRent: '',
    description: '',
    yearBuilt: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages([...images, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()])
      setAmenityInput('')
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLodge: Omit<Property, 'id'> = {
      name: formData.name,
      address: formData.address,
      type: 'lodge',
      status: 'available',
      yearlyRent: parseFloat(formData.yearlyRent),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      description: formData.description,
      amenities,
      yearBuilt: parseInt(formData.yearBuilt),
      parkingSpaces: formData.parkingSpaces,
      numberOfRooms: parseInt(formData.numberOfRooms),
      numberOfKitchens: parseInt(formData.numberOfKitchens),
      numberOfBathrooms: parseInt(formData.numberOfBathrooms),
      waterAvailability: formData.waterAvailability,
      rooms: []
    }

    onAdd(newLodge)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Lodge</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lodge Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sunrise Lodge"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full address"
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
                  placeholder="3000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Built *</label>
                <input
                  type="number"
                  name="yearBuilt"
                  required
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2020"
                />
              </div>
            </div>
          </div>

          {/* Lodge Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lodge Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms *</label>
                <input
                  type="number"
                  name="numberOfRooms"
                  required
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Kitchens *</label>
                <input
                  type="number"
                  name="numberOfKitchens"
                  required
                  value={formData.numberOfKitchens}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bathrooms *</label>
                <input
                  type="number"
                  name="numberOfBathrooms"
                  required
                  value={formData.numberOfBathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Availability *</label>
                <select
                  name="waterAvailability"
                  required
                  value={formData.waterAvailability}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-building">In Building</option>
                  <option value="in-compound">In Compound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces *</label>
                <select
                  name="parkingSpaces"
                  required
                  value={formData.parkingSpaces}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the lodge..."
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lodge Images</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mb-3"
            >
              <Upload className="w-4 h-4" /> Upload from Device
            </button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img src={preview} alt={`Lodge ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Security, Generator, Water Tank"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {amenity}
                  <button type="button" onClick={() => handleRemoveAmenity(index)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Lodge
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
