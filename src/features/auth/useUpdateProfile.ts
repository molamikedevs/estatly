import { updateProfileApi } from "@/api/apiAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { isPending, mutate: updateProfile } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      toast.success("Profile was successfully updated")
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },

    onError: (error) => {
      console.error("Update profile error:", error)
      toast.error(error.message || "Failed to update profile")
    },
  })

  return { isPending, updateProfile }
}
