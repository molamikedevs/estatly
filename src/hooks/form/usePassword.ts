import { useUpdateProfile } from "@/features/auth/useUpdateProfile"
import { passwordSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

type PasswordFormValues = z.infer<typeof passwordSchema>

export function usePassword() {
  const { updateProfile, isPending } = useUpdateProfile()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  })

  const onSubmit = handleSubmit((values) => {
    updateProfile({ password: values.password }, { onSuccess: () => reset() })
  })

  const disabled = isPending || !isDirty

  return { disabled, onSubmit, control, isPending, reset }
}
