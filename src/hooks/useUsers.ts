import { useQuery } from '@tanstack/react-query'
import { userApi } from '../lib/api'

/**
 * Resolves a set of user ids to display names. Used where the app only holds
 * ids — conversation participants, for instance — and needs to show a person.
 */
export const useUserDirectory = (ids: string[]) => {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean))).sort()

  const { data, isLoading } = useQuery({
    queryKey: ['users', uniqueIds],
    queryFn: () => userApi.getByIds(uniqueIds),
    enabled: uniqueIds.length > 0,
  })

  const byId = new Map((data || []).map((user) => [user.id, user]))

  return {
    isLoading,
    /** Display name for an id, falling back to a neutral label. */
    nameFor: (id?: string) => (id && byId.get(id)?.name) || 'Student',
    universityFor: (id?: string) => (id && byId.get(id)?.university) || '',
  }
}
