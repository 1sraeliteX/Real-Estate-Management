'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { Property, Occupant } from '@/types'
import { getPropertyTypes } from '@/lib/propertyTypes'

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (property: Omit<Property, 'id'>) => void
}

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'apartment' as Property['type'],
    status: 'available' as Property['status'],
    yearlyRent: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    yearBuilt: '',
  })

  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')
  const [occupants, setOccupants] = useState<Occupant[]>([])
  const [occupantForm, setOccupantForm] = useState({ name: '', email: '', phone: '', relationship: '' })
  const [proofOfPayment, setProofOfPayment] = useState<string[]>([])
  const [paymentInput, setPaymentInput] = useState('')
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])

  useEffect(() => {
    setPropertyTypes(getPropertyTypes())
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()])
      setImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
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

  const handleAddOccupant = () => {
    if (occupantForm.name.trim()) {
      setOccupants([...occupants, { 
        id: Date.now().toString(), 
        ...occupantForm 
      }])
      setOccupantForm({ name: '', email: '', phone: '', relationship: '' })
    }
  }

  const handleRemoveOccupant = (id: string) => {
    setOccupants(occupants.filter(o => o.id !== id))
  }

  const handleAddPaymentProof = () => {
    if (paymentInput.trim()) {
      setProofOfPayment([...proofOfPayment, paymentInput.trim()])
      setPaymentInput('')
    }
  }

  const handleRemovePaymentProof = (index: number) => {
    setProofOfPayment(proofOfPayment.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProperty: Omit<Property, 'id'> = {
      name: formData.name,
      address: formData.address,
      type: formData.type,
      status: formData.status,
      yearlyRent: parseFloat(formData.yearlyRent),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseFloat(formData.area),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      description: formData.description,
      amenities,
      yearBuilt: parseInt(formData.yearBuilt),
      parkingSpaces: 0,
    }

    onAdd(newProperty)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sunset Apartments 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
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
                  placeholder="Full address including city and zip code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
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
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  required
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  required
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft) *</label>
                <input
                  type="number"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
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

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the property..."
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Property ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Air Conditioning, Pool, Gym"
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

          {/* Divider */}
          <div className="border-t border-gray-300 my-2"></div>

          {/* Occupants Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Occupant Information</h3>
            <p className="text-sm text-gray-600 mb-4">Add occupants who will be living in this property (optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={occupantForm.name}
                onChange={(e) => setOccupantForm({ ...occupantForm, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={occupantForm.email}
                onChange={(e) => setOccupantForm({ ...occupantForm, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
              />
              <input
                type="tel"
                value={occupantForm.phone}
                onChange={(e) => setOccupantForm({ ...occupantForm, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone"
              />
              <input
                type="text"
                value={occupantForm.relationship}
                onChange={(e) => setOccupantForm({ ...occupantForm, relationship: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Relationship (e.g., Primary Tenant, Spouse)"
              />
            </div>
            <button
              type="button"
              onClick={handleAddOccupant}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mb-3"
            >
              <Plus className="w-4 h-4" /> Add Occupant
            </button>
            <div className="space-y-2">
              {occupants.map((occupant) => (
                <div key={occupant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{occupant.name}</p>
                    <p className="text-sm text-gray-600">{occupant.relationship}</p>
                    {occupant.email && <p className="text-sm text-gray-600">{occupant.email}</p>}
                    {occupant.phone && <p className="text-sm text-gray-600">{occupant.phone}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOccupant(occupant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-2"></div>

          {/* Proof of Payment Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof of Payment</h3>
            <p className="text-sm text-gray-600 mb-4">Upload payment receipts or documents (optional)</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter payment receipt URL or document link"
              />
              <button
                type="button"
                onClick={handleAddPaymentProof}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {proofOfPayment.map((proof, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <a href={proof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate flex-1">
                    {proof}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemovePaymentProof(index)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
