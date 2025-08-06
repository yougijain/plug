import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '../lib/api'
import type { Message } from '../types'

export const useConversations = (userId: string) => {
  console.log('🔍 [useConversations] Starting...', userId)

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      console.log('🔍 [useConversations] Query function called...')
      try {
        console.log('🔍 [useConversations] Calling messagesApi.getConversations...')
        const data = await messagesApi.getConversations(userId)
        console.log('✅ [useConversations] Query successful, got', data?.length || 0, 'conversations')
        return data
      } catch (err) {
        console.error('❌ [useConversations] Query error:', err)
        throw err
      }
    },
    enabled: !!userId
  })

  return { conversations: conversations || [], isLoading, error }
}

export const useMessages = (conversationId: string) => {
  console.log('🔍 [useMessages] Starting...', conversationId)

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      console.log('🔍 [useMessages] Query function called...')
      try {
        console.log('🔍 [useMessages] Calling messagesApi.getMessages...')
        const data = await messagesApi.getMessages(conversationId)
        console.log('✅ [useMessages] Query successful, got', data?.length || 0, 'messages')
        return data
      } catch (err) {
        console.error('❌ [useMessages] Query error:', err)
        throw err
      }
    },
    enabled: !!conversationId
  })

  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: Omit<Message, 'id' | 'created_at'>) => {
      console.log('🔍 [useMessages.sendMessageMutation] Starting...', messageData)
      try {
        console.log('🔍 [useMessages.sendMessageMutation] Calling messagesApi.sendMessage...')
        const data = await messagesApi.sendMessage(messageData)
        console.log('✅ [useMessages.sendMessageMutation] Message sent successfully:', data)
        return data
      } catch (err) {
        console.error('❌ [useMessages.sendMessageMutation] Error:', err)
        throw err
      }
    },
    onSuccess: (newMessage) => {
      console.log('🔍 [useMessages.sendMessageMutation] onSuccess called:', newMessage)
      console.log('🔍 [useMessages.sendMessageMutation] Invalidating messages query...')
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      console.log('✅ [useMessages.sendMessageMutation] Messages query invalidated')
    },
    onError: (error) => {
      console.error('❌ [useMessages.sendMessageMutation] onError:', error)
    }
  })

  const sendMessage = (messageData: Omit<Message, 'id' | 'created_at'>) => {
    console.log('🔍 [useMessages] sendMessage called:', messageData)
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