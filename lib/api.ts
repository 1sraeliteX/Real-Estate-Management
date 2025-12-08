import axios from 'axios'
import { Property, Room, RoomOccupant, MaintenanceRequest, Payment } from '@/types'
import { mockApiAdapter } from './mockApiAdapter'

// Configure your API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Properties API
export const propertiesApi = {
  getAll: () => USE_MOCK ? mockApiAdapter.properties.getAll() : api.get<Property[]>('/properties'),
  getById: (id: string) => USE_MOCK ? mockApiAdapter.properties.getById(id) : api.get<Property>(`/properties/${id}`),
  create: (data: Omit<Property, 'id'>) => USE_MOCK ? mockApiAdapter.properties.create(data) : api.post<Property>('/properties', data),
  update: (id: string, data: Partial<Property>) => USE_MOCK ? mockApiAdapter.properties.update(id, data) : api.put<Property>(`/properties/${id}`, data),
  delete: (id: string) => USE_MOCK ? mockApiAdapter.properties.delete(id) : api.delete(`/properties/${id}`),
}

// Rooms API
export const roomsApi = {
  getAll: () => USE_MOCK ? mockApiAdapter.rooms.getAll() : api.get<Room[]>('/rooms'),
  getByProperty: (propertyId: string) => USE_MOCK ? mockApiAdapter.rooms.getByProperty(propertyId) : api.get<Room[]>(`/properties/${propertyId}/rooms`),
  getById: (id: string) => USE_MOCK ? mockApiAdapter.rooms.getById(id) : api.get<Room>(`/rooms/${id}`),
  create: (data: Omit<Room, 'id'>) => USE_MOCK ? mockApiAdapter.rooms.create(data) : api.post<Room>('/rooms', data),
  update: (id: string, data: Partial<Room>) => USE_MOCK ? mockApiAdapter.rooms.update(id, data) : api.put<Room>(`/rooms/${id}`, data),
  delete: (id: string) => USE_MOCK ? mockApiAdapter.rooms.delete(id) : api.delete(`/rooms/${id}`),
}

// Occupants API
export const occupantsApi = {
  getAll: () => USE_MOCK ? mockApiAdapter.occupants.getAll() : api.get<RoomOccupant[]>('/occupants'),
  getByRoom: (roomId: string) => USE_MOCK ? mockApiAdapter.occupants.getByRoom(roomId) : api.get<RoomOccupant[]>(`/rooms/${roomId}/occupants`),
  getById: (id: string) => USE_MOCK ? mockApiAdapter.occupants.getById(id) : api.get<RoomOccupant>(`/occupants/${id}`),
  create: (data: Omit<RoomOccupant, 'id'>) => USE_MOCK ? mockApiAdapter.occupants.create(data) : api.post<RoomOccupant>('/occupants', data),
  update: (id: string, data: Partial<RoomOccupant>) => USE_MOCK ? mockApiAdapter.occupants.update(id, data) : api.put<RoomOccupant>(`/occupants/${id}`, data),
  delete: (id: string) => USE_MOCK ? mockApiAdapter.occupants.delete(id) : api.delete(`/occupants/${id}`),
}

// Payments API
export const paymentsApi = {
  getAll: () => api.get<Payment[]>('/payments'),
  create: (data: Omit<Payment, 'id'>) => api.post<Payment>('/payments', data),
  update: (id: string, data: Partial<Payment>) => api.put<Payment>(`/payments/${id}`, data),
}

// Maintenance API
export const maintenanceApi = {
  getAll: () => api.get<MaintenanceRequest[]>('/maintenance'),
  getByProperty: (propertyId: string) => api.get<MaintenanceRequest[]>(`/properties/${propertyId}/maintenance`),
  create: (data: Omit<MaintenanceRequest, 'id'>) => api.post<MaintenanceRequest>('/maintenance', data),
  update: (id: string, data: Partial<MaintenanceRequest>) => api.put<MaintenanceRequest>(`/maintenance/${id}`, data),
}

// Dashboard Stats API
export const statsApi = {
  getDashboard: () => USE_MOCK ? mockApiAdapter.stats.getDashboard() : api.get('/stats/dashboard'),
  getFinances: () => USE_MOCK ? mockApiAdapter.stats.getFinances() : api.get('/stats/finances'),
}

export default api
