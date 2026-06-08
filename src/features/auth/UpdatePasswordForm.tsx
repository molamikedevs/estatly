import PasswordField from "@/components/form-components/PasswordField"
import Spinner from "@/components/SpinnerMini"
import { Button } from "@/components/ui/button"
import { KeyRound } from "lucide-react"
import { Link } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { usePassword } from "@/features/auth/usePassword"

export default function UpdatePasswordForm() {
  const { disabled, onSubmit, control, isPending, reset } = usePassword()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* ambient background — matches Login page */}
      <div className="spotlight pointer-events-none absolute inset-0 opacity-60" />
      <div className="pattern-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30" />

      <div className="relative w-full max-w-md">
        {/* lock badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <KeyRound className="h-6 w-6" />
          </div>
        </div>

        <Card className="border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Change password</CardTitle>
            <CardDescription className="text-xs">
              Use at least 8 characters. Mix letters, numbers and symbols for
              better security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="update-password-form"
              onSubmit={onSubmit}
              className="w-full"
            >
              <FieldGroup className="space-y-5">
                <PasswordField
                  control={control}
                  name="password"
                  id="password-new"
                  label="New password"
                  placeholder="••••••••"
                  description="At least 8 characters."
                />

                <PasswordField
                  control={control}
                  name="confirmPassword"
                  id="password-confirm"
                  label="Confirm new password"
                  placeholder="••••••••"
                />

                <Field
                  orientation="horizontal"
                  className="justify-end gap-2 pt-2"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => reset()}
                    disabled={disabled}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={disabled}
                    className="min-w-[140px] gap-2 shadow-sm"
                  >
                    {isPending ? (
                      <>
                        <Spinner size="sm" />
                        Updating…
                      </>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
