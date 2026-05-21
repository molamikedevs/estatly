import { getCurrentUserApi } from "@/api/apiAuth"
import { useQuery } from "@tanstack/react-query"

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserApi,
  })

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" }
}
