import { getUserApi } from "@/api/apiUsers"
import type { CreatableRole, UserProfile } from "@/types/database"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useTeamMember(role: CreatableRole) {
  const { userId } = useParams()
  const queryClient = useQueryClient()
  console.log(userId)

  const {
    data: member,
    isLoading,
    error,
  } = useQuery({
    queryKey: [role, userId],
    queryFn: () => getUserApi(userId as string),
    enabled: Boolean(userId),

    //  If the users list is already cached, show that user(agent or manager)
    // instantly with no spinner. If not, the query fetches it.
    initialData: () => {
      const list = queryClient.getQueryData<UserProfile[]>([`${role}s`])
      return list?.find((a) => a.user_id === userId)
    },
  })

  return { member, isLoading, error }
}
