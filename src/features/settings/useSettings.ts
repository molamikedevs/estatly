import { getSettingsApi } from "@/api/apiSettings"
import { useQuery } from "@tanstack/react-query"

export function useSettings() {
  const { isLoading, data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettingsApi,
  })

  return { isLoading, settings }
}
