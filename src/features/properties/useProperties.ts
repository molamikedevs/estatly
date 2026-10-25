import { getPropertiesApi } from "@/api/apiProperties"
import type { PropertiesQueryParams } from "@/types/database"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useProperties(params: PropertiesQueryParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["properties", params],
    queryFn: () => getPropertiesApi(params),
    placeholderData: keepPreviousData,
  })

  return { isLoading, data, error, refetch }
}
