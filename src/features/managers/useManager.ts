import { getManagerApi } from "@/api/apiManager"
import type { UserProfile } from "@/types/database"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useManager() {
  const { managerId } = useParams()
  const queryClient = useQueryClient()

  const {
    data: manager,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manager", managerId],
    queryFn: () => getManagerApi(managerId!),
    enabled: Boolean(managerId),

    //  If the managers list is already cached, show that manager
    // instantly with no spinner. If not, the query fetches it.
    initialData: () => {
      const list = queryClient.getQueryData<UserProfile[]>(["managers"])
      return list?.find((a) => a.user_id === managerId)
    },
  })

  return { manager, isLoading, error }
}
