import { PropertyType, TwilioSettings } from '@prisma/client'

export class SettingsClient {
  // Property Types
  static async getPropertyTypes(): Promise<PropertyType[]> {
    const response = await fetch('/api/settings/property-types')
    
    if (!response.ok) {
      throw new Error('Failed to get property types')
    }

    const data = await response.json()
    return data.propertyTypes
  }

  static async addPropertyType(name: string): Promise<PropertyType> {
    const response = await fetch('/api/settings/property-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add property type')
    }

    const data = await response.json()
    return data.propertyType
  }

  static async removePropertyType(name: string): Promise<void> {
    const response = await fetch(`/api/settings/property-types?name=${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove property type')
    }
  }

  // Twilio Settings
  static async getTwilioSettings(): Promise<TwilioSettings | null> {
    const response = await fetch('/api/settings/twilio')
    
    if (!response.ok) {
      throw new Error('Failed to get Twilio settings')
    }

    const data = await response.json()
    return data.twilioSettings
  }

  static async updateTwilioSettings(settings: any): Promise<TwilioSettings> {
    const response = await fetch('/api/settings/twilio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update Twilio settings')
    }

    const data = await response.json()
    return data.twilioSettings
  }
}