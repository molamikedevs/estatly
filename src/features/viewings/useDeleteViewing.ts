import { deleteViewingApi } from "@/api/apiViewings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteViewing() {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteViewing } = useMutation({
    mutationFn: deleteViewingApi,

    onSuccess: () => {
      toast.success("Viewing deleted")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, deleteViewing }
}
