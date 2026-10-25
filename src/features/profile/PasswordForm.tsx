import PageSection from "@/components/form-components/PageSection"
import PasswordField from "@/components/form-components/PasswordField"
import { Button } from "@/components/ui/button"
import { useChangePassword } from "@/features/auth/useChangePassword"
import { passwordSchema, type PasswordFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Its own form: changing your password never mixes with your details
export default function PasswordForm() {
  const { changePassword, isPending } = useChangePassword()

  const { control, handleSubmit, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit((values) => {
    changePassword(values, { onSuccess: () => reset() })
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <PageSection
        title="Password"
        description="At least 8 characters. You stay signed in after changing it."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <PasswordField
            control={control}
            name="password"
            id="profile-new-password"
            label="New password"
            autoComplete="new-password"
            required
          />
          <PasswordField
            control={control}
            name="confirmPassword"
            id="profile-confirm-password"
            label="Confirm new password"
            autoComplete="new-password"
            required
          />
        </div>

        {/* Wrapper keeps the button its natural width */}
        <div className="flex">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </div>
      </PageSection>
    </form>
  )
}
