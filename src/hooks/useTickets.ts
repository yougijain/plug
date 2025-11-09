import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi, savedTicketsApi } from '../lib/api'
import type { Ticket, TicketInsert } from '../types'
import { useAppStore } from '../lib/store'

export function useTickets(filters?: {
  campusId?: string
  sellerId?: string
  status?: string
  search?: string
}) {
  const { setError } = useAppStore()
  const queryClient = useQueryClient()

  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsApi.getAll(filters),
    staleTime: 1000 * 30, // 30 seconds
  })

  const { mutateAsync: createTicket, isPending: isCreatingTicket } = useMutation({
    mutationFn: (ticketData: Omit<TicketInsert, 'id' | 'created_at' | 'updated_at'>) =>
      ticketsApi.create(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to create ticket:', error)
      setError(error?.message || 'Failed to create ticket')
    }
  })

  const { mutateAsync: updateTicket } = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Ticket> }) =>
      ticketsApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to update ticket:', error)
      setError(error?.message || 'Failed to update ticket')
    }
  })

  const { mutateAsync: deleteTicket } = useMutation({
    mutationFn: (id: string) => ticketsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to delete ticket:', error)
      setError(error?.message || 'Failed to delete ticket')
    }
  })

  const { mutateAsync: markSold } = useMutation({
    mutationFn: ({ ticketId, quantity }: { ticketId: string; quantity?: number }) =>
      ticketsApi.markSold(ticketId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to mark ticket sold:', error)
      setError(error?.message || 'Failed to mark ticket as sold')
    }
  })

  return {
    tickets,
    isLoading,
    error,
    createTicket,
    isCreatingTicket,
    updateTicket,
    deleteTicket,
    markSold
  }
}

export function useTicket(id: string | undefined) {
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => id ? ticketsApi.getById(id) : Promise.resolve(null),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  })

  return {
    ticket,
    isLoading,
    error
  }
}

export function useSavedTickets(userId: string | undefined) {
  const { setError } = useAppStore()
  const queryClient = useQueryClient()

  const { data: savedTickets = [], isLoading } = useQuery({
    queryKey: ['savedTickets', userId],
    queryFn: () => userId ? savedTicketsApi.getSaved(userId) : Promise.resolve([]),
    enabled: !!userId,
  })

  const { mutateAsync: saveTicket } = useMutation({
    mutationFn: ({ userId, ticketId }: { userId: string; ticketId: string }) =>
      savedTicketsApi.save(userId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedTickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to save ticket:', error)
      setError(error?.message || 'Failed to save ticket')
    }
  })

  const { mutateAsync: unsaveTicket } = useMutation({
    mutationFn: ({ userId, ticketId }: { userId: string; ticketId: string }) =>
      savedTicketsApi.unsave(userId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedTickets'] })
    },
    onError: (error: any) => {
      console.error('Failed to unsave ticket:', error)
      setError(error?.message || 'Failed to unsave ticket')
    }
  })

  return {
    savedTickets,
    isLoading,
    saveTicket,
    unsaveTicket
  }
}

// Legacy export for compatibility
export const usePosts = useTickets

