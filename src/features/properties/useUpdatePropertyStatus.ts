import { updatePropertyStatusApi } from "@/api/apiProperties"
import type { PropertyStatus } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()
  const { isPending, mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: PropertyStatus }) =>
      updatePropertyStatusApi(id, status),

    onSuccess: () => {
      toast.success("Property status updated")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateStatus }
}
