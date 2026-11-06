import { createTeamMemberApi } from "@/api/apiTeam"
import type { CreatableRole } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateTeamMember(role: CreatableRole) {
  const queryClient = useQueryClient()

  const { isPending, mutate: createMember } = useMutation({
    mutationFn: createTeamMemberApi,

    onSuccess: () => {
      toast.success(`${role === "agent" ? "Agent" : "Manager"} added`)
      queryClient.invalidateQueries({ queryKey: ["team", role] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createMember }
}
