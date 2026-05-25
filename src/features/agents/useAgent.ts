import { getAgentApi } from "@/api/apiAgents"
import type { UserProfile } from "@/types/database"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useAgent() {
  const { agentId } = useParams()
  const queryClient = useQueryClient()

  const {
    data: agent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgentApi(agentId!),
    enabled: Boolean(agentId),

    //  If the agents list is already cached, show that agent
    // instantly with no spinner. If not, the query fetches it.
    initialData: () => {
      const list = queryClient.getQueryData<UserProfile[]>(["agents"])
      return list?.find((a) => a.user_id === agentId)
    },
  })

  return { agent, isLoading, error }
}
