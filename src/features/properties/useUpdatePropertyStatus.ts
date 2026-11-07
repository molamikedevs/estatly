import { updatePropertyStatusApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateStatus } = useMutation({
    mutationFn: updatePropertyStatusApi,

    onSuccess: () => {
      toast.success("Listing status updated")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateStatus }
}
