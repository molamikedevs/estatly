import { updateUserApi } from "@/api/apiAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { isPending, mutate: updateProfile } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      toast.success("User profile was successfully updated")
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  return { isPending, updateProfile }
}
