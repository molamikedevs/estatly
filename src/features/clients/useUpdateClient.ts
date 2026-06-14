import { updateClientStatusApi } from "@/api/apiClients"
import type { ClientStatus } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateClient } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ClientStatus }) =>
      updateClientStatusApi(id, status),

    onSuccess: () => {
      toast.success("Client status updated")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateClient }
}
