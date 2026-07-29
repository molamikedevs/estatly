import { getViewingsApi } from "@/api/apiViewings"
import type { ViewingsQueryParams } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

export function useViewings(params: ViewingsQueryParams) {
  const { isLoading, data } = useQuery({
    queryKey: ["viewings", params],
    queryFn: () => getViewingsApi(params),
  })

  return { isLoading, data }
}
