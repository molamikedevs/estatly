import { getClientsApi } from "@/api/apiClients"
import { useQuery } from "@tanstack/react-query"

export function useClients() {
  const {
    isLoading,
    data: clients,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClientsApi,
  })

  return { isLoading, clients, error, refetch }
}
