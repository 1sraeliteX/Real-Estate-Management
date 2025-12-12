/**
 * Mock API Adapter - Updated to use database instead of localStorage
 * 
 * This adapter now proxies to the actual database API endpoints
 * instead of using localStorage for persistence.
 */

import { Property, Room, RoomOccupant } from '@/types'

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to make API calls
const apiCall = async (url: string, options?: RequestInit) => {
  await delay()
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }
  return response.json()
}

export const mockApiAdapter = {
  // Properties - now using database API
  properties: {
    getAll: async () => {
      const result = await apiCall('/api/properties')
      return { data: result.properties }
    },
    getById: async (id: string) => {
      const result = await apiCall(`/api/properties/${id}`)
      return { data: result.property }
    },
    create: async (data: Omit<Property, 'id'>) => {
      const result = await apiCall('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.property }
    },
    update: async (id: string, data: Partial<Property>) => {
      const result = await apiCall(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.property }
    },
    delete: async (id: string) => {
      const result = await apiCall(`/api/properties/${id}`, {
        method: 'DELETE'
      })
      return { data: result.property }
    },
  },

  // Rooms - now using database API
  rooms: {
    getAll: async () => {
      const result = await apiCall('/api/rooms')
      return { data: result.rooms }
    },
    getByProperty: async (propertyId: string) => {
      const result = await apiCall(`/api/properties/${propertyId}/rooms`)
      return { data: result.rooms }
    },
    getById: async (id: string) => {
      const result = await apiCall(`/api/rooms/${id}`)
      return { data: result.room }
    },
    create: async (data: Omit<Room, 'id'>) => {
      const result = await apiCall('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.room }
    },
    update: async (id: string, data: Partial<Room>) => {
      const result = await apiCall(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.room }
    },
    delete: async (id: string) => {
      const result = await apiCall(`/api/rooms/${id}`, {
        method: 'DELETE'
      })
      return { data: result.room }
    },
  },

  // Occupants - now using database API
  occupants: {
    getAll: async () => {
      const result = await apiCall('/api/occupants')
      return { data: result.occupants }
    },
    getByRoom: async (roomId: string) => {
      const result = await apiCall(`/api/rooms/${roomId}/occupants`)
      return { data: result.occupants }
    },
    getById: async (id: string) => {
      const result = await apiCall(`/api/occupants/${id}`)
      return { data: result.occupant }
    },
    create: async (data: Omit<RoomOccupant, 'id'>) => {
      const result = await apiCall('/api/occupants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.occupant }
    },
    update: async (id: string, data: Partial<RoomOccupant>) => {
      const result = await apiCall(`/api/occupants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return { data: result.occupant }
    },
    delete: async (id: string) => {
      const result = await apiCall(`/api/occupants/${id}`, {
        method: 'DELETE'
      })
      return { data: result.occupant }
    },
  },

  // Stats - now using database API
  stats: {
    getDashboard: async () => {
      const result = await apiCall('/api/stats/dashboard')
      return { data: result.stats }
    },
    getFinances: async () => {
      const result = await apiCall('/api/stats/finances')
      return { data: result.stats }
    },
  },
}
