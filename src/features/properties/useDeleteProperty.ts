import { deletePropertyApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteProperty } = useMutation({
    mutationFn: deletePropertyApi,

    onSuccess: () => {
      toast.success("Property deleted")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, deleteProperty }
}
