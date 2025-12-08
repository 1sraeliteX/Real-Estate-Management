import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { maintenanceApi } from '@/lib/api'
import { MaintenanceRequest } from '@/types'

export function useMaintenance() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const response = await maintenanceApi.getAll()
      return response.data
    },
  })
}

export function usePropertyMaintenance(propertyId: string) {
  return useQuery({
    queryKey: ['maintenance', 'property', propertyId],
    queryFn: async () => {
      const response = await maintenanceApi.getByProperty(propertyId)
      return response.data
    },
    enabled: !!propertyId,
  })
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<MaintenanceRequest, 'id'>) => maintenanceApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      if (response.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['maintenance', 'property', response.data.propertyId] })
      }
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceRequest> }) =>
      maintenanceApi.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      if (response.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['maintenance', 'property', response.data.propertyId] })
      }
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
