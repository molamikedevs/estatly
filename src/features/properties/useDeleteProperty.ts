import { deletePropertyApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteProperty } = useMutation({
    mutationFn: deletePropertyApi,

    onSuccess: () => {
      toast.success("Property successfully deleted")
      queryClient.invalidateQueries({ queryKey: ["property"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, deleteProperty }
}
