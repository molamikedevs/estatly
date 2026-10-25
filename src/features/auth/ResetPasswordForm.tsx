import PasswordField from "@/components/form-components/PasswordField"
import { Button } from "@/components/ui/button"
import { passwordSchema, type PasswordFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useChangePassword } from "./useChangePassword"

// The email link signs the user in for recovery; here they choose the new password
export default function ResetPasswordForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { changePassword, isPending } = useChangePassword()

  const { control, handleSubmit } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit((values) => {
    changePassword(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] })
        navigate("/dashboard", { replace: true })
      },
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <PasswordField
        control={control}
        name="password"
        id="new-password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
      />
      <PasswordField
        control={control}
        name="confirmPassword"
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        required
      />
      <Button type="submit" className="h-11 w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Save new password"}
      </Button>
    </form>
  )
}
