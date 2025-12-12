import { Property } from '@prisma/client'

export interface PropertyData {
  name: string
  address: string
  type: string
  status: string
  yearlyRent: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  description: string
  amenities: string
  images: string
  yearBuilt: number
  parkingSpaces: string
  numberOfRooms?: number
  numberOfKitchens?: number
  numberOfBathrooms?: number
  waterAvailability?: string
}

export class PropertyClient {
  static async getProperties(type?: string, search?: string): Promise<Property[]> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (search) params.append('search', search)

    const response = await fetch(`/api/properties?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to get properties')
    }

    const data = await response.json()
    return data.properties
  }

  static async getPropertyById(id: string): Promise<Property> {
    const response = await fetch(`/api/properties/${id}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get property')
    }

    const data = await response.json()
    return data.property
  }

  static async createProperty(propertyData: PropertyData): Promise<Property> {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create property')
    }

    const data = await response.json()
    return data.property
  }

  static async updateProperty(id: string, propertyData: Partial<PropertyData>): Promise<Property> {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update property')
    }

    const data = await response.json()
    return data.property
  }

  static async deleteProperty(id: string): Promise<Property> {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete property')
    }

    const data = await response.json()
    return data.property
  }

  static async getPropertyStats() {
    const response = await fetch('/api/properties/stats')
    
    if (!response.ok) {
      throw new Error('Failed to get property stats')
    }

    const data = await response.json()
    return data.stats
  }
}