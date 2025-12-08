// Utility functions for managing property types

const DEFAULT_PROPERTY_TYPES = [
  'apartment',
  'house',
  'condo',
  'commercial',
  'lodge',
  'studio'
]

export function getPropertyTypes(): string[] {
  if (typeof window === 'undefined') {
    return DEFAULT_PROPERTY_TYPES
  }
  
  const savedTypes = localStorage.getItem('propertyTypes')
  if (savedTypes) {
    try {
      return JSON.parse(savedTypes)
    } catch {
      return DEFAULT_PROPERTY_TYPES
    }
  }
  return DEFAULT_PROPERTY_TYPES
}

export function savePropertyTypes(types: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('propertyTypes', JSON.stringify(types))
  }
}

export function addPropertyType(type: string): string[] {
  const types = getPropertyTypes()
  const normalizedType = type.toLowerCase().trim()
  
  if (!types.includes(normalizedType) && normalizedType) {
    const updatedTypes = [...types, normalizedType]
    savePropertyTypes(updatedTypes)
    return updatedTypes
  }
  
  return types
}

export function removePropertyType(type: string): string[] {
  const types = getPropertyTypes()
  const updatedTypes = types.filter(t => t !== type)
  savePropertyTypes(updatedTypes)
  return updatedTypes
}
