import { setTeamMemberActiveApi } from "@/api/apiUsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSetMemberActive() {
  const queryClient = useQueryClient()

  const { isPending, mutate: setActive } = useMutation({
    mutationFn: setTeamMemberActiveApi,

    onSuccess: (_data, { isActive }) => {
      toast.success(isActive ? "Access restored" : "Access removed")
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, setActive }
}
