import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomsApi } from '@/lib/api'
import { Room } from '@/types'

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      try {
        const response = await roomsApi.getAll()
        // Handle both mock API (response.data is array) and real API (response.data.rooms is array)
        return Array.isArray(response.data) ? response.data : response.data.rooms || []
      } catch (error) {
        console.error('Error fetching rooms:', error)
        return [] // Return empty array on error
      }
    },
    retry: false, // Don't retry on error to avoid cascading failures
  })
}

export function usePropertyRooms(propertyId: string) {
  return useQuery({
    queryKey: ['rooms', 'property', propertyId],
    queryFn: async () => {
      const response = await roomsApi.getByProperty(propertyId)
      // Handle both mock API (response.data is array) and real API (response.data.rooms is array)
      return Array.isArray(response.data) ? response.data : response.data.rooms || []
    },
    enabled: !!propertyId,
  })
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: async () => {
      const response = await roomsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateRoom(onActivityLog?: (roomNumber: string, propertyName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Room, 'id'>) => roomsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['rooms', 'property', variables.propertyId] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(variables.roomNumber, variables.propertyName)
      }
    },
  })
}

export function useUpdateRoom(onActivityLog?: (roomNumber: string, propertyName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Room> }) =>
      roomsApi.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.id] })
      if (response.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['rooms', 'property', response.data.propertyId] })
      }
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog && response.data.roomNumber && response.data.propertyName) {
        onActivityLog(response.data.roomNumber, response.data.propertyName)
      }
    },
  })
}

export function useDeleteRoom(onActivityLog?: (roomNumber: string, propertyName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Get room info before deleting
      const rooms = queryClient.getQueryData<Room[]>(['rooms'])
      const room = rooms?.find(r => r.id === id)
      const response = await roomsApi.delete(id)
      return { response, roomNumber: room?.roomNumber || 'Room', propertyName: room?.propertyName || 'Property' }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(data.roomNumber, data.propertyName)
      }
    },
  })
}
