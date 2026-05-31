import { incrementPropertyViewsApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useIncrementPropertyViews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: incrementPropertyViewsApi,
    onSuccess: (_nextCount, id) => {
      // Match whatever key shape your useProperty hook uses
      queryClient.invalidateQueries({ queryKey: ["property", String(id)] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },
    onError: (err) => console.error("View increment failed:", err),
  })
}
