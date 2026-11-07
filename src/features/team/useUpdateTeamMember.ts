import { updateTeamMemberApi } from "@/api/apiTeam"
import { refreshPeople } from "@/lib/refreshPeople"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateMember } = useMutation({
    mutationFn: updateTeamMemberApi,

    onSuccess: () => {
      toast.success("Details saved")
      refreshPeople(queryClient)
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateMember }
}
