import { getAgencySettingsApi } from "@/api/apiSettings"
import { useQuery } from "@tanstack/react-query"

export function useSettings() {
  const {
    isLoading,
    data: settings,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getAgencySettingsApi,
  })

  return { isLoading, settings, error, refetch }
}
