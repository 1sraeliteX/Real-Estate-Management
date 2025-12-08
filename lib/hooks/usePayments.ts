import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '@/lib/api'
import { Payment } from '@/types'

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await paymentsApi.getAll()
      return response.data
    },
  })
}

export function usePropertyPayments(propertyId: string) {
  return useQuery({
    queryKey: ['payments', 'property', propertyId],
    queryFn: async () => {
      const response = await paymentsApi.getAll()
      // Filter by propertyId on client side
      return response.data.filter(p => p.propertyId === propertyId)
    },
    enabled: !!propertyId,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Payment, 'id'>) => paymentsApi.create(data),
    onSuccess: (response) => {
      // Invalidate all payment-related queries
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      if (response.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['payments', 'property', response.data.propertyId] })
      }
      // Update financial stats and properties
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
      paymentsApi.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      if (response.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['payments', 'property', response.data.propertyId] })
      }
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
