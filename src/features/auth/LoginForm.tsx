import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/features/auth/useLogin"
import { loginSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import type { z } from "zod"

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const { isPending, login } = useLogin()

  const { control, handleSubmit, resetField } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  })

  const onSubmit = handleSubmit((values) => {
    login(values, {
      // Keep the email on a failed attempt — only clear the password.
      onError: () => resetField("password"),
    })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <IconField
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
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  )
}
