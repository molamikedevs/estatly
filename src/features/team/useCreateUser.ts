import { createUserApi } from "@/api/apiUsers"
import type { CreatableRole } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const roleLabel: Record<CreatableRole, string> = {
  manager: "Manager",
  agent: "Agent",
}

/**
 * Creates a user with the given role. The role drives both the
 * success message and which list query gets invalidated, so agents
 * and managers share one hook.
 */

export function useCreateUser(role: CreatableRole) {
  const queryClient = useQueryClient()
  const { isPending, mutate: createUser } = useMutation({
    mutationFn: createUserApi,

    onSuccess: () => {
      toast.success(`${roleLabel[role]} was successfully created`)
      queryClient.invalidateQueries({ queryKey: [`${role}s`] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createUser }
}
