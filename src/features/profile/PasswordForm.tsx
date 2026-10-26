import PageSection from "@/components/form-components/PageSection"
import PasswordField from "@/components/form-components/PasswordField"
import { Button } from "@/components/ui/button"
import { useChangePassword } from "@/features/auth/useChangePassword"
import { useUser } from "@/features/auth/useUser"
import { isDemoEmail } from "@/lib/demo"
import { passwordSchema, type PasswordFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Its own form: changing your password never mixes with your details
export default function PasswordForm() {
  const { user } = useUser()
  const { changePassword, isPending } = useChangePassword()

  const { control, handleSubmit, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit((values) => {
    changePassword(values, { onSuccess: () => reset() })
  })

  // The database also blocks this; hiding it just avoids a confusing error
  if (isDemoEmail(user?.email)) {
    return (
      <PageSection
        title="Password"
        description="Shared demo accounts keep the same password for everyone."
      >
        <p className="text-sm text-muted-foreground">
          Password changes are turned off for demo accounts.
        </p>
      </PageSection>
    )
  }

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
