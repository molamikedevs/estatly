import { createUserApi } from "@/api/apiUsers"
import type { CreatableRole } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateTeam(role: CreatableRole) {
  const queryClient = useQueryClient()

  const { isPending, mutate: createUser } = useMutation({
    mutationFn: createUserApi,

    onSuccess: () => {
      toast.success(`${role === "agent" ? "Agent" : "Manager"} added`)
      queryClient.invalidateQueries({ queryKey: ["team", role] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createUser }
}
