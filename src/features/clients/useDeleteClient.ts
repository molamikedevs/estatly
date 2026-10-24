import { deleteClientApi } from "@/api/apiClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteClient } = useMutation({
    mutationFn: deleteClientApi,

    onSuccess: () => {
      toast.success("Client deleted")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, deleteClient }
}
