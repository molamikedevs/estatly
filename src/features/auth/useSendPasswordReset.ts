import { sendPasswordResetApi } from "@/api/apiAuth"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSendPasswordReset() {
  const {
    isPending,
    isSuccess,
    mutate: sendReset,
  } = useMutation({
    mutationFn: sendPasswordResetApi,
    onError: (err) => toast.error(err.message),
  })

  return { isPending, isSent: isSuccess, sendReset }
}
