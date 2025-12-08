import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesApi } from '@/lib/api'
import { Property } from '@/types'

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await propertiesApi.getAll()
      return response.data
    },
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await propertiesApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateProperty(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Property, 'id'>) => propertiesApi.create(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(variables.name)
      }
    },
  })
}

export function useUpdateProperty(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      propertiesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog && variables.data.name) {
        onActivityLog(variables.data.name)
      }
    },
  })
}

export function useDeleteProperty(onActivityLog?: (name: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Get property name before deleting
      const property = queryClient.getQueryData<Property[]>(['properties'])?.find(p => p.id === id)
      const response = await propertiesApi.delete(id)
      return { response, propertyName: property?.name || 'Property' }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      // Log activity
      if (onActivityLog) {
        onActivityLog(data.propertyName)
      }
    },
  })
}
