import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { occupantsApi } from '@/lib/api'
import { RoomOccupant } from '@/types'

export function useOccupants() {
  return useQuery({
    queryKey: ['occupants'],
    queryFn: async () => {
      const response = await occupantsApi.getAll()
      // Handle both mock API (response.data is array) and real API (response.data.occupants is array)
      return Array.isArray(response.data) ? response.data : response.data.occupants || []
    },
  })
}

export function useRoomOccupants(roomId: string) {
  return useQuery({
    queryKey: ['occupants', 'room', roomId],
    queryFn: async () => {
      const response = await occupantsApi.getByRoom(roomId)
      // Handle both mock API (response.data is array) and real API (response.data.occupants is array)
      return Array.isArray(response.data) ? response.data : response.data.occupants || []
    },
    enabled: !!roomId,
  })
}

export function useCreateOccupant(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<RoomOccupant, 'id'>) => occupantsApi.create(data),
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['occupants'] })
      queryClient.invalidateQueries({ queryKey: ['occupants', 'room', variables.roomId] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(variables.name)
      }
    },
  })
}

export function useUpdateOccupant(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoomOccupant> }) =>
      occupantsApi.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['occupants'] })
      if (response.data.roomId) {
        queryClient.invalidateQueries({ queryKey: ['occupants', 'room', response.data.roomId] })
      }
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog && response.data.name) {
        onActivityLog(response.data.name)
      }
    },
  })
}

export function useDeleteOccupant(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Get occupant name before deleting
      const occupants = queryClient.getQueryData<RoomOccupant[]>(['occupants'])
      const occupant = occupants?.find(o => o.id === id)
      const response = await occupantsApi.delete(id)
      return { response, occupantName: occupant?.name || 'Occupant' }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['occupants'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(data.occupantName)
      }
    },
  })
}
