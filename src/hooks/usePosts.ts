import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../lib/api'
import type { Post } from '../types'
import { log } from '../lib/logger'

export const usePosts = (filters?: {
  type?: string
  category?: string
  status?: string
  userId?: string
  isFlash?: boolean
}) => {
  const queryClient = useQueryClient()

  log('[usePosts] Hook called with filters:', filters)

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      log('[usePosts] Query function called with filters:', filters)
      
      try {
        log('[usePosts] Calling postsApi.getAll...')
        const data = await postsApi.getAll(filters)
        log('[usePosts] Query successful, got', data?.length || 0, 'posts')
        return data
      } catch (err) {
        console.error('[usePosts] Query error:', err)
        throw err
      }
    }
  })

  const createPostMutation = useMutation({
    mutationFn: async (postData: Omit<Post, 'id' | 'created_at'>) => {
      log('[usePosts.createPostMutation] Starting...', postData)
      
      try {
        log('[usePosts.createPostMutation] Calling postsApi.create...')
        const result = await postsApi.create({
          user_id: postData.user_id,
          type: postData.type,
          title: postData.title,
          description: postData.description,
          price: postData.price,
          category: postData.category,
          location: postData.location,
          images: postData.images,
          expires_at: postData.expires_at,
          status: postData.status,
          tags: postData.tags,
          is_flash_deal: postData.is_flash_deal,
          flash_deal_expires_at: postData.flash_deal_expires_at
        })
        log('[usePosts.createPostMutation] Success:', result)
        return result
      } catch (err) {
        console.error('[usePosts.createPostMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (newPost) => {
      log('[usePosts.createPostMutation] onSuccess called:', newPost)
      // Optimistically update any cached posts lists
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        // old is array of posts or undefined
        if (!old) return [newPost]
        if (Array.isArray(old)) return [newPost, ...old]
        return old
      })
      // Also update user-specific lists if present
      queryClient.getQueryCache().findAll({ queryKey: ['posts'] }).forEach((q) => {
        const key = q.queryKey as any[]
        const filters = key?.[1]
        if (filters?.userId && filters.userId === newPost.user_id) {
          queryClient.setQueryData(['posts', filters], (old: any) => {
            if (!old) return [newPost]
            if (Array.isArray(old)) return [newPost, ...old]
            return old
          })
        }
      })
      // Finally, invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      log('[usePosts.createPostMutation] Posts cache updated and invalidated')
    },
    onError: (error) => {
      console.error('[usePosts.createPostMutation] onError:', error)
    }
  })

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Post> }) => {
      log('[usePosts.updatePostMutation] Starting...', { id, updates })
      
      try {
        log('[usePosts.updatePostMutation] Calling postsApi.update...')
        const result = await postsApi.update(id, updates)
        log('[usePosts.updatePostMutation] Success:', result)
        return result
      } catch (err) {
        console.error('[usePosts.updatePostMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (updatedPost) => {
      log('[usePosts.updatePostMutation] onSuccess called:', updatedPost)
      log('[usePosts.updatePostMutation] Invalidating posts query...')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      log('[usePosts.updatePostMutation] Posts query invalidated')
    },
    onError: (error) => {
      console.error('[usePosts.updatePostMutation] onError:', error)
    }
  })

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      log('[usePosts.deletePostMutation] Starting...', { id })
      
      try {
        log('[usePosts.deletePostMutation] Calling postsApi.delete...')
        await postsApi.delete(id)
        log('[usePosts.deletePostMutation] Success')
      } catch (err) {
        console.error('[usePosts.deletePostMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: () => {
      log('[usePosts.deletePostMutation] onSuccess called')
      log('[usePosts.deletePostMutation] Invalidating posts query...')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      log('[usePosts.deletePostMutation] Posts query invalidated')
    },
    onError: (error) => {
      console.error('[usePosts.deletePostMutation] onError:', error)
    }
  })

  return {
    posts: posts || [],
    isLoading,
    error,
    createPost: createPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    isUpdatingPost: updatePostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending
  }
}

export const usePost = (id: string) => {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      log('[usePost] Query function called with id:', id)
      
      try {
        log('[usePost] Calling postsApi.getById...')
        const data = await postsApi.getById(id)
        log('[usePost] Query successful:', data)
        return data
      } catch (err) {
        console.error('[usePost] Query error:', err)
        throw err
      }
    },
    enabled: !!id
  })

  return { post, isLoading, error }
} 