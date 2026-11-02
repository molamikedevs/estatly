import TextField from "@/components/form-components/TextField"
import { Button } from "@/components/ui/button"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSendPasswordReset } from "./useSendPasswordReset"

export default function ForgotPasswordForm() {
  const { sendReset, isPending, isSent } = useSendPasswordReset()

  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  // Same message whether the account exists or not, so emails can't be probed
  if (isSent) {
    return (
      <p role="status" className="rounded-lg bg-muted p-4 text-sm">
        If an account exists for that email, a reset link is on its way. Check
        your inbox and spam folder.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((values) => sendReset(values))}
      noValidate
      className="space-y-5"
    >
      <TextField
        control={control}
        name="email"
        id="reset-email"
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@agency.com"
        required
      />
      <Button type="submit" className="h-11 w-full" disabled={isPending}>
        {isPending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  )
}
