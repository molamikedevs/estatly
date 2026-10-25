import { updateProfileApi } from "@/api/apiProfile"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateProfile } = useMutation({
    mutationFn: updateProfileApi,

    onSuccess: () => {
      toast.success("Profile saved")
      queryClient.invalidateQueries({ queryKey: ["user"] })
      // Your name shows on team cards too
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateProfile }
}
