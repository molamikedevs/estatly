import { getUsersByRoleApi } from "@/api/apiUsers"
import type { CreatableRole } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

/**
 * Fetches the list of users with the given role. Replaces the separate
 * useAgents / useManagers hooks — the role drives both the query key
 * and the API filter.
 */
export function useUsers(role: CreatableRole) {
  const { isLoading, data: users } = useQuery({
    queryKey: [`${role}s`],
    queryFn: () => getUsersByRoleApi(role),
  })

  return { isLoading, users }
}
