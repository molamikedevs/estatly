import { getRecentViewingsApi } from "@/api/apiViewings"
import { useQuery } from "@tanstack/react-query"

export function useRecentViewings() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "recent-viewings"],
    queryFn: getRecentViewingsApi,
  })

  return { recentViewings: data ?? [], isLoading }
}
