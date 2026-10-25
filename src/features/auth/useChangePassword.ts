import { changePasswordApi } from "@/api/apiAuth"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useChangePassword() {
  const { isPending, mutate: changePassword } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => toast.success("Password updated"),
    onError: (err) => toast.error(err.message),
  })

  return { isPending, changePassword }
}
