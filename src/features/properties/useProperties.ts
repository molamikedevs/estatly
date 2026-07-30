import { getPropertiesApi } from "@/api/apiProperties"
import type { PropertiesQueryParams } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

export function useProperties(params: PropertiesQueryParams) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", params],
    queryFn: () => getPropertiesApi(params),
  })

  return { isLoading, data, error }
}
