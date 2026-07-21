import { getClientViewingsApi } from "@/api/apiViewings"
import { useQuery } from "@tanstack/react-query"

export function useClientViewings(clientId: number) {
  const { isLoading, data: viewings } = useQuery({
    queryKey: ["client-viewings", clientId],
    queryFn: () => getClientViewingsApi(clientId),
    enabled: Number.isFinite(clientId) && clientId > 0,
  })

  return { isLoading, viewings: viewings ?? [] }
}
