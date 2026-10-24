import { updateTeamMemberApi } from "@/api/apiUsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateMember } = useMutation({
    mutationFn: updateTeamMemberApi,

    onSuccess: () => {
      toast.success("Details saved")
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateMember }
}
