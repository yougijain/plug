import { useQuery } from '@tanstack/react-query'
import { campusesApi } from '../lib/api'

export function useCampuses() {
  const { data: campuses = [], isLoading, error } = useQuery({
    queryKey: ['campuses'],
    queryFn: () => campusesApi.getAll(),
    staleTime: 1000 * 60 * 60, // 1 hour (campuses don't change often)
    retry: 3, // Retry 3 times on failure
    retryDelay: 1000, // 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    campuses,
    isLoading,
    error
  }
}

export function useCampusByDomain(domain: string | undefined) {
  const { data: campus, isLoading, error } = useQuery({
    queryKey: ['campus', domain],
    queryFn: () => domain ? campusesApi.getByDomain(domain) : Promise.resolve(null),
    enabled: !!domain,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  return {
    campus,
    isLoading,
    error
  }
}

