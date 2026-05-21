import { getAgentsApi } from "@/api/apiAgents"
import { useQuery } from "@tanstack/react-query"

export function useAgents() {
  const { isLoading, data: agents } = useQuery({
    queryFn: getAgentsApi,
    queryKey: ["agents"],
  })

  return { isLoading, agents }
}
