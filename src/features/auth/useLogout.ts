import { logoutApi } from "@/api/apiAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { isPending, mutate: logout } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries()
      navigate("/login", { replace: true })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, logout }
}
