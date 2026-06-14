import { getPropertiesByStatusApi } from "@/api/apiProperties"
import { useQuery } from "@tanstack/react-query"

export function usePropertiesByStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "property-status"],
    queryFn: getPropertiesByStatusApi,
  })
  return { propertiesByStatus: data ?? [], isLoading }
}
