// Utility functions for managing property types - now using database
import { SettingsClient } from './client/settingsClient'

const DEFAULT_PROPERTY_TYPES = [
  'apartment',
  'house',
  'condo',
  'commercial',
  'lodge',
  'studio'
]

// Client-side functions that use the API
export async function getPropertyTypes(): Promise<string[]> {
  try {
    const propertyTypes = await SettingsClient.getPropertyTypes()
    return propertyTypes.map(pt => pt.name)
  } catch (error) {
    console.error('Failed to get property types:', error)
    return DEFAULT_PROPERTY_TYPES
  }
}

export async function addPropertyType(type: string): Promise<string[]> {
  try {
    await SettingsClient.addPropertyType(type)
    return await getPropertyTypes()
  } catch (error) {
    console.error('Failed to add property type:', error)
    throw error
  }
}

export async function removePropertyType(type: string): Promise<string[]> {
  try {
    await SettingsClient.removePropertyType(type)
    return await getPropertyTypes()
  } catch (error) {
    console.error('Failed to remove property type:', error)
    throw error
  }
}

// Synchronous fallback for SSR/initial render
export function getDefaultPropertyTypes(): string[] {
  return DEFAULT_PROPERTY_TYPES
}
