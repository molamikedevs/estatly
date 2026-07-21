import { updateClientApi } from "@/api/apiClients"
import type { ClientFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateClient } = useMutation({
    mutationFn: ({
      newClient,
      id,
    }: {
      newClient: ClientFormValues
      id: string
    }) => updateClientApi(newClient, id),

    onSuccess: () => {
      toast.success("Client successfully updated")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["client"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateClient }
}
