import { updateClientApi } from "@/api/apiClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useEditClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: editClient } = useMutation({
    mutationFn: updateClientApi,

    onSuccess: () => {
      toast.success("Client updated")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      // Viewings show the client's name
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, editClient }
}
