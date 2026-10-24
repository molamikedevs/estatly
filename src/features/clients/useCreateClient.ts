import { createClientApi } from "@/api/apiClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: createClient } = useMutation({
    mutationFn: createClientApi,

    onSuccess: () => {
      toast.success("Client added")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createClient }
}
