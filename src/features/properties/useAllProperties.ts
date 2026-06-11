// new hook file
import { getAllPropertiesApi } from "@/api/apiProperties"
import { useQuery } from "@tanstack/react-query"

export function useAllProperties() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties", "all"],
    queryFn: getAllPropertiesApi,
  })
  return { properties: data ?? [], isLoading }
}
