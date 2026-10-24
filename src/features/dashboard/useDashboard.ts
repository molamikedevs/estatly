import { getDashboardApi } from "@/api/apiDashboard"
import { useUser } from "@/features/auth/useUser"
import { useQuery } from "@tanstack/react-query"

export function useDashboard() {
  const { user } = useUser()
  const role = user?.user_profile?.role
  const userId = user?.id

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", role, userId],
    queryFn: () => getDashboardApi(role!, userId!),
    enabled: Boolean(role && userId),
  })

  return { dashboard: data, isLoading, error, refetch, role }
}
