import { getClientsByStageApi } from "@/api/apiClients"
import { useQuery } from "@tanstack/react-query"

export function useClientsByStage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "client-status"],
    queryFn: getClientsByStageApi,
  })

  return { clientsByStage: data ?? [], isLoading }
}
