import { incrementPropertyViewsApi } from "@/api/apiProperties"
import type { Property } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useIncrementPropertyViews() {
  const queryClient = useQueryClient()

  const { mutate: incrementViews } = useMutation({
    mutationFn: incrementPropertyViewsApi,
    onSuccess: (nextCount, id) => {
      // Same key shape as useProperty (a number), updated in place, no refetch
      queryClient.setQueryData<Property>(["property", id], (old) =>
        old ? { ...old, views_count: nextCount } : old
      )
      // Lists pick up the new count next time they load
      queryClient.invalidateQueries({
        queryKey: ["properties"],
        refetchType: "none",
      })
    },
    onError: (err) => console.error("View increment failed:", err),
  })

  return { incrementViews }
}
