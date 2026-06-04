import { getManagersApi } from "@/api/apiManager"
import { useQuery } from "@tanstack/react-query"

export function useManagers() {
  const { isLoading, data: managers } = useQuery({
    queryFn: getManagersApi,
    queryKey: ["managers"],
  })

  return { isLoading, managers }
}
