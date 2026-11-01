import { getCurrentUserApi } from "@/api/apiAuth"
import { useQuery } from "@tanstack/react-query"

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserApi,
    // The signed-in user rarely changes; login, logout and profile
    // updates refresh this query themselves
    staleTime: 5 * 60 * 1000,
  })

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" }
}
