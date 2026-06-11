import { updateViewingStatusApi } from "@/api/apiViewings"
import type { Viewing, ViewingStatus } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type ViewingsCache = { data: Viewing[]; count: number }

export function useUpdateViewing() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateViewing } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ViewingStatus }) =>
      updateViewingStatusApi(id, status),

    // 1. BEFORE the request
    onMutate: async ({ id, status }) => {
      // stop fetches so a late refetch can't clobber our write
      await queryClient.cancelQueries({ queryKey: ["viewings"] })

      //  every cached page (returns [key, data][])
      const prev = queryClient.getQueriesData({ queryKey: ["viewings"] })

      // write the new status into every matching page
      queryClient.setQueriesData<ViewingsCache>(
        { queryKey: ["viewings"] },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((v) => (v.id === id ? { ...v, status } : v)),
              }
            : old
      )

      return { prev }
    },

    // 2. IF it fails => restore each snapshot
    onError: (err, _vars, context) => {
      context?.prev.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      )
      toast.error(err.message)
    },
    // 3. resync with server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
    },
  })

  return { isPending, updateViewing }
}
