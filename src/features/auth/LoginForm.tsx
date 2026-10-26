import PasswordField from "@/components/form-components/PasswordField"
import TextField from "@/components/form-components/TextField"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/features/auth/useLogin"
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  getDemoRole,
  type DemoRole,
} from "@/lib/demo"
import { loginSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router-dom"
import type { z } from "zod"

type LoginFormValues = z.infer<typeof loginSchema>

const DEMO_ROLES: DemoRole[] = ["admin", "manager", "agent"]

export default function LoginForm() {
  const { isPending, login } = useLogin()

  // /login?demo=admin arrives from the portfolio with the form filled in
  const [searchParams] = useSearchParams()
  const demoRole = getDemoRole(searchParams.get("demo"))

  const { control, handleSubmit, resetField } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: demoRole ? DEMO_ACCOUNTS[demoRole] : "",
      password: demoRole ? DEMO_PASSWORD : "",
    },
    mode: "onBlur",
  })

  const onSubmit = handleSubmit((values) => {
    login(values, {
      // Keep the email on a failed attempt: only clear the password.
      onError: () => resetField("password"),
    })
  })

  function signInAs(role: DemoRole) {
    login({ email: DEMO_ACCOUNTS[role], password: DEMO_PASSWORD })
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <TextField
          control={control}
          name="email"
          id="login-email"
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@agency.com"
          required
        />

        <PasswordField
          control={control}
          name="password"
          id="login-password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          labelAddon={
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          }
        />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full cursor-pointer font-medium shadow-sm"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* One click per role for recruiters */}
      <section className="border-t pt-5">
        <p className="text-sm font-medium">Try the demo</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Shared test data. Each role sees what it would in a real agency.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMO_ROLES.map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              className="capitalize"
              disabled={isPending}
              onClick={() => signInAs(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}
