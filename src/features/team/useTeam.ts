import { getTeamApi } from "@/api/apiTeam"
import type { CreatableRole } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

export function useTeam(role: CreatableRole) {
  const {
    data: team,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["team", role],
    queryFn: () => getTeamApi(role),
  })

  return { team, isLoading, error, refetch }
}
