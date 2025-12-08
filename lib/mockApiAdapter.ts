/**
 * Mock API Adapter
 * 
 * This adapter allows you to use the same API hooks with mock data
 * while developing without a backend. Set NEXT_PUBLIC_USE_MOCK=true
 * in .env.local to enable mock mode.
 */

import { mockProperties, mockRooms } from './mockApi'
import { Property, Room, RoomOccupant } from '@/types'

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Extract occupants from rooms
const extractOccupants = (): RoomOccupant[] => {
  const allOccupants: RoomOccupant[] = []
  mockRooms.forEach(room => {
    room.occupants.forEach(occupant => {
      allOccupants.push(occupant)
    })
  })
  return allOccupants
}

// LocalStorage helpers
const STORAGE_KEYS = {
  PROPERTIES: 'mock_properties',
  ROOMS: 'mock_rooms',
  OCCUPANTS: 'mock_occupants',
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Initialize data from localStorage or use defaults
const getProperties = () => loadFromStorage(STORAGE_KEYS.PROPERTIES, [...mockProperties])
const getRooms = () => loadFromStorage(STORAGE_KEYS.ROOMS, [...mockRooms])
const getOccupants = () => loadFromStorage(STORAGE_KEYS.OCCUPANTS, extractOccupants())

export const mockApiAdapter = {
  // Properties
  properties: {
    getAll: async () => {
      await delay()
      const properties = getProperties()
      return { data: properties }
    },
    getById: async (id: string) => {
      await delay()
      const properties = getProperties()
      const property = properties.find(p => p.id === id)
      if (!property) throw new Error('Property not found')
      return { data: property }
    },
    create: async (data: Omit<Property, 'id'>) => {
      await delay()
      const properties = getProperties()
      const newProperty = { ...data, id: `prop-${Date.now()}` } as Property
      properties.push(newProperty)
      saveToStorage(STORAGE_KEYS.PROPERTIES, properties)
      return { data: newProperty }
    },
    update: async (id: string, data: Partial<Property>) => {
      await delay()
      const properties = getProperties()
      const index = properties.findIndex(p => p.id === id)
      if (index === -1) throw new Error('Property not found')
      properties[index] = { ...properties[index], ...data }
      saveToStorage(STORAGE_KEYS.PROPERTIES, properties)
      return { data: properties[index] }
    },
    delete: async (id: string) => {
      await delay()
      const properties = getProperties()
      const deleted = properties.find(p => p.id === id)
      if (!deleted) throw new Error('Property not found')
      const updated = properties.filter(p => p.id !== id)
      saveToStorage(STORAGE_KEYS.PROPERTIES, updated)
      return { data: deleted }
    },
  },

  // Rooms
  rooms: {
    getAll: async () => {
      await delay()
      const rooms = getRooms()
      return { data: rooms }
    },
    getByProperty: async (propertyId: string) => {
      await delay()
      const rooms = getRooms()
      return { data: rooms.filter(r => r.propertyId === propertyId) }
    },
    getById: async (id: string) => {
      await delay()
      const rooms = getRooms()
      const room = rooms.find(r => r.id === id)
      if (!room) throw new Error('Room not found')
      return { data: room }
    },
    create: async (data: Omit<Room, 'id'>) => {
      await delay()
      const rooms = getRooms()
      const newRoom = { ...data, id: `room-${Date.now()}` } as Room
      rooms.push(newRoom)
      saveToStorage(STORAGE_KEYS.ROOMS, rooms)
      return { data: newRoom }
    },
    update: async (id: string, data: Partial<Room>) => {
      await delay()
      const rooms = getRooms()
      const index = rooms.findIndex(r => r.id === id)
      if (index === -1) throw new Error('Room not found')
      rooms[index] = { ...rooms[index], ...data }
      saveToStorage(STORAGE_KEYS.ROOMS, rooms)
      return { data: rooms[index] }
    },
    delete: async (id: string) => {
      await delay()
      const rooms = getRooms()
      const deleted = rooms.find(r => r.id === id)
      if (!deleted) throw new Error('Room not found')
      const updated = rooms.filter(r => r.id !== id)
      saveToStorage(STORAGE_KEYS.ROOMS, updated)
      return { data: deleted }
    },
  },

  // Occupants
  occupants: {
    getAll: async () => {
      await delay()
      const occupants = getOccupants()
      return { data: occupants }
    },
    getByRoom: async (roomId: string) => {
      await delay()
      const occupants = getOccupants()
      return { data: occupants.filter(o => o.roomId === roomId) }
    },
    getById: async (id: string) => {
      await delay()
      const occupants = getOccupants()
      const occupant = occupants.find(o => o.id === id)
      if (!occupant) throw new Error('Occupant not found')
      return { data: occupant }
    },
    create: async (data: Omit<RoomOccupant, 'id'>) => {
      await delay()
      const occupants = getOccupants()
      const rooms = getRooms()
      const newOccupant = { ...data, id: `occ-${Date.now()}` } as RoomOccupant
      occupants.push(newOccupant)
      saveToStorage(STORAGE_KEYS.OCCUPANTS, occupants)
      
      // Update room status
      const roomIndex = rooms.findIndex(r => r.id === data.roomId)
      if (roomIndex !== -1) {
        rooms[roomIndex].status = 'occupied'
        rooms[roomIndex].occupants.push(newOccupant)
        saveToStorage(STORAGE_KEYS.ROOMS, rooms)
      }
      
      return { data: newOccupant }
    },
    update: async (id: string, data: Partial<RoomOccupant>) => {
      await delay()
      const occupants = getOccupants()
      const index = occupants.findIndex(o => o.id === id)
      if (index === -1) throw new Error('Occupant not found')
      occupants[index] = { ...occupants[index], ...data }
      saveToStorage(STORAGE_KEYS.OCCUPANTS, occupants)
      return { data: occupants[index] }
    },
    delete: async (id: string) => {
      await delay()
      const occupants = getOccupants()
      const rooms = getRooms()
      const occupant = occupants.find(o => o.id === id)
      if (!occupant) throw new Error('Occupant not found')
      
      // Update room status if no more occupants
      const roomOccupants = occupants.filter(o => o.roomId === occupant.roomId && o.id !== id)
      if (roomOccupants.length === 0) {
        const roomIndex = rooms.findIndex(r => r.id === occupant.roomId)
        if (roomIndex !== -1) {
          rooms[roomIndex].status = 'available'
          rooms[roomIndex].occupants = []
          saveToStorage(STORAGE_KEYS.ROOMS, rooms)
        }
      }
      
      const updated = occupants.filter(o => o.id !== id)
      saveToStorage(STORAGE_KEYS.OCCUPANTS, updated)
      return { data: occupant }
    },
  },

  // Stats
  stats: {
    getDashboard: async () => {
      await delay()
      const properties = getProperties()
      const rooms = getRooms()
      const occupants = getOccupants()
      const totalRooms = rooms.length
      const occupiedRooms = rooms.filter(r => r.status === 'occupied').length
      const totalFinance = occupants.reduce((sum, occ) => sum + occ.amountPaid, 0)
      const pendingPayments = occupants.reduce((sum, occ) => sum + (occ.totalRent - occ.amountPaid), 0)
      
      return {
        data: {
          totalFinance,
          totalProperties: properties.length,
          totalOccupants: occupants.length,
          occupiedProperties: properties.filter(p => p.status === 'occupied').length,
          availableProperties: properties.filter(p => p.status === 'available').length,
          pendingPayments,
          totalRooms,
          occupiedRooms,
          vacantRooms: totalRooms - occupiedRooms,
        },
      }
    },
    getFinances: async () => {
      await delay()
      const occupants = getOccupants()
      const totalRevenue = occupants.reduce((sum, occ) => sum + occ.amountPaid, 0)
      const expectedRevenue = occupants.reduce((sum, occ) => sum + occ.totalRent, 0)
      const pendingPayments = expectedRevenue - totalRevenue
      
      return {
        data: {
          totalRevenue,
          expectedRevenue,
          pendingPayments,
          collectionRate: expectedRevenue > 0 ? (totalRevenue / expectedRevenue) * 100 : 0,
        },
      }
    },
  },
}
