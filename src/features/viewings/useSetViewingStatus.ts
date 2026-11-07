import { updateViewingStatusApi } from "@/api/apiViewings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSetViewingStatus() {
  const queryClient = useQueryClient()

  const { isPending, mutate: setStatus } = useMutation({
    mutationFn: updateViewingStatusApi,

    onSuccess: () => {
      toast.success("Status updated")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, setStatus }
}
