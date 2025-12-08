import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: async () => {
      const response = await statsApi.getDashboard()
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useFinanceStats() {
  return useQuery({
    queryKey: ['stats', 'finances'],
    queryFn: async () => {
      const response = await statsApi.getFinances()
      return response.data
    },
    refetchInterval: 30000,
  })
}
