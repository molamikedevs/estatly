import { createAgentApi } from "@/api/apiAgents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateAgent() {
  const queryClient = useQueryClient()
  const { isPending, mutate: createAgent } = useMutation({
    mutationFn: createAgentApi,
    onSuccess: (data) => {
      const role = data?.user?.role
      toast.success(
        `${role === "manager" ? "Manager" : "Agent"} was successfully created`
      )
      queryClient.invalidateQueries({ queryKey: ["agents"] })
    },

    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { isPending, createAgent }
}
