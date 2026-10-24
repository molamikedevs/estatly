import { updateClientStatusApi } from "@/api/apiClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Moves a client to another pipeline stage
export function useUpdateClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateClient } = useMutation({
    mutationFn: updateClientStatusApi,

    onSuccess: () => {
      toast.success("Client moved")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateClient }
}
