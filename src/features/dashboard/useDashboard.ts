import { getDashboardStatsApi } from "@/api/apiDashboard"
import { useQuery } from "@tanstack/react-query"

export function useDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStatsApi,
  })

  return { stats: data, isLoading }
}
