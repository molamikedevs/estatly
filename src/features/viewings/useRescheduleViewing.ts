import { rescheduleViewingApi } from "@/api/apiViewings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useRescheduleViewing() {
  const queryClient = useQueryClient()

  const { isPending, mutate: rescheduleViewing } = useMutation({
    mutationFn: rescheduleViewingApi,

    onSuccess: () => {
      toast.success("Viewing rescheduled")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, rescheduleViewing }
}
