import { getCurrentUserApi, loginApi } from "@/api/apiAuth"
import type { UserLogin } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { isPending, mutate: login } = useMutation({
    mutationFn: (values: UserLogin) => loginApi(values),

    // Load the full user (with role) before entering the app,
    // so the sidebar never renders without a role.
    // staleTime: 0 forces a real fetch: a signed-out visit may have
    // cached `null` for the user, and that cache must not be reused.
    onSuccess: async () => {
      await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getCurrentUserApi,
        staleTime: 0,
      })
      navigate("/dashboard", { replace: true })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, login }
}
