import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesApi } from '@/lib/api'
import { Property } from '@/types'

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await propertiesApi.getAll()
      // Handle both mock API (response.data is array) and real API (response.data.properties is array)
      return Array.isArray(response.data) ? response.data : response.data.properties || []
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
    mutationFn: async (data: Omit<Property, 'id'>) => {
      // Validate data before sending
      if (!data.name?.trim()) {
        throw new Error('Property name is required')
      }
      if (!data.address?.trim()) {
        throw new Error('Property address is required')
      }
      if (!data.yearlyRent || data.yearlyRent <= 0) {
        throw new Error('Valid yearly rent is required')
      }

      // Ensure arrays are properly formatted
      const formattedData = {
        ...data,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        images: Array.isArray(data.images) ? data.images : []
      }

      console.log('Creating property with data:', formattedData)
      
      try {
        const response = await propertiesApi.create(formattedData)
        console.log('Property created successfully:', response.data)
        return response
      } catch (error) {
        console.error('Property creation failed:', error)
        
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any
          if (axiosError.response?.data?.details) {
            console.error('Error details:', axiosError.response.data.details)
          }
        }
        
        throw error
      }
    },
    onSuccess: (response, variables) => {
      console.log('Property creation mutation succeeded')
      
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      
      // Log activity
      if (onActivityLog) {
        onActivityLog(variables.name)
      }
    },
    onError: (error, variables) => {
      console.error('Property creation mutation failed:', error)
      console.error('Failed data:', variables)
      
      // You can add toast notifications here
      // toast.error(error.message || 'Failed to create property')
    },
    retry: (failureCount, error) => {
      // Don't retry validation errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        if (axiosError.response?.status === 400) {
          return false
        }
      }
      // Retry network errors up to 2 times
      return failureCount < 2
    }
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
