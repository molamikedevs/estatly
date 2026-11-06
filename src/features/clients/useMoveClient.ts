import { moveClientApi } from "@/api/apiClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useMoveClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: moveClient } = useMutation({
    mutationFn: moveClientApi,

    onSuccess: () => {
      toast.success("Client moved")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, moveClient }
}
