import { updateViewingStatusApi } from "@/api/apiViewings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateViewing() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateViewing } = useMutation({
    mutationFn: updateViewingStatusApi,

    onSuccess: () => {
      toast.success("Viewing updated")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateViewing }
}
