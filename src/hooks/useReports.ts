import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '../lib/api'
import type { ReportInsert, Report } from '../types'
import { useAppStore } from '../lib/store'

export function useReports(status?: string) {
  const { setError } = useAppStore()
  const queryClient = useQueryClient()

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports', status],
    queryFn: () => reportsApi.getAll(status),
    staleTime: 1000 * 30, // 30 seconds
  })

  const { mutateAsync: createReport, isPending: isCreatingReport } = useMutation({
    mutationFn: (reportData: Omit<ReportInsert, 'id' | 'created_at'>) =>
      reportsApi.create(reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: (error: any) => {
      console.error('Failed to create report:', error)
      setError(error?.message || 'Failed to submit report')
    }
  })

  const { mutateAsync: updateReport } = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Report> }) =>
      reportsApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: (error: any) => {
      console.error('Failed to update report:', error)
      setError(error?.message || 'Failed to update report')
    }
  })

  return {
    reports,
    isLoading,
    error,
    createReport,
    isCreatingReport,
    updateReport
  }
}

