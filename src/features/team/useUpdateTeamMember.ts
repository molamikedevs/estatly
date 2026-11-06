import { updateTeamMemberApi } from "@/api/apiTeam"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateMember } = useMutation({
    mutationFn: updateTeamMemberApi,

    onSuccess: () => {
      toast.success("Details saved")
      queryClient.invalidateQueries({ queryKey: ["team"] })
      // These pages join agent:user_profiles(full_name, avatar)
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property"] })
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateMember }
}
