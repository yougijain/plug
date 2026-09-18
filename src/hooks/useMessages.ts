import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '../lib/api'
import type { Conversation, Message } from '../types'
import { log } from '../lib/logger'

export const useConversations = (userId: string) => {
  log('[useConversations] Starting...', userId)

  // Typed as the app-level Conversation: the listing fields are view-model extras
  // the backend adapter may join in, not columns on the conversations table.
  const { data: conversations, isLoading, error } = useQuery<Conversation[]>({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      log('[useConversations] Query function called...')
      try {
        log('[useConversations] Calling messagesApi.getConversations...')
        const data = await messagesApi.getConversations(userId)
        log('[useConversations] Query successful, got', data?.length || 0, 'conversations')
        return data
      } catch (err) {
        console.error('[useConversations] Query error:', err)
        throw err
      }
    },
    enabled: !!userId
  })

  return { conversations: conversations || [], isLoading, error }
}

export const useMessages = (conversationId: string) => {
  log('[useMessages] Starting...', conversationId)

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      log('[useMessages] Query function called...')
      try {
        log('[useMessages] Calling messagesApi.getMessages...')
        const data = await messagesApi.getMessages(conversationId)
        log('[useMessages] Query successful, got', data?.length || 0, 'messages')
        return data
      } catch (err) {
        console.error('[useMessages] Query error:', err)
        throw err
      }
    },
    enabled: !!conversationId
  })

  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: Omit<Message, 'id' | 'created_at'>) => {
      log('[useMessages.sendMessageMutation] Starting...', messageData)
      try {
        log('[useMessages.sendMessageMutation] Calling messagesApi.sendMessage...')
        const data = await messagesApi.sendMessage(messageData)
        log('[useMessages.sendMessageMutation] Message sent successfully:', data)
        return data
      } catch (err) {
        console.error('[useMessages.sendMessageMutation] Error:', err)
        throw err
      }
    },
    onSuccess: (newMessage) => {
      log('[useMessages.sendMessageMutation] onSuccess called:', newMessage)
      log('[useMessages.sendMessageMutation] Invalidating messages query...')
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      log('[useMessages.sendMessageMutation] Messages query invalidated')
    },
    onError: (error) => {
      console.error('[useMessages.sendMessageMutation] onError:', error)
    }
  })

  const sendMessage = (messageData: Omit<Message, 'id' | 'created_at'>) => {
    log('[useMessages] sendMessage called:', messageData)
    sendMessageMutation.mutate(messageData)
  }

  return { 
    messages: messages || [], 
    isLoading, 
    error, 
    sendMessage,
    isSending: sendMessageMutation.isPending
  }
} 