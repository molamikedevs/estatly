import { createAgentApi } from "@/api/apiAgents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateManager() {
  const queryClient = useQueryClient()
  const { isPending, mutate: createManager } = useMutation({
    mutationFn: createAgentApi,
    onSuccess: () => {
      toast.success(`manager was successfully created`)
      queryClient.invalidateQueries({ queryKey: ["agents"] })
    },

    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { isPending, createManager }
}
