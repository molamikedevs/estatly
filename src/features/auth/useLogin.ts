import { loginApi } from "@/api/apiAuth"
import type { UserLogin } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { isPending, mutate: login } = useMutation({
    mutationFn: ({ email, password }: UserLogin) =>
      loginApi({ email, password }),

    // success do this
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user)
      navigate("/dashboard", { replace: true })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, login }
}
