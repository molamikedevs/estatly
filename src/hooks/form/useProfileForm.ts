import { useUpdateProfile } from "@/features/auth/useUpdateProfile"
import { useUser } from "@/features/auth/useUser"
import { profileSchema } from "@/lib/validation"
import type { ProfileFormValues } from "@/types/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const EMPTY_VALUES: ProfileFormValues = {
  full_name: "",
  phone: "",
  specialization: "",
  bio: "",
  password: "",
  confirmPassword: "",
}

interface UseProfileFormParams {
  /** Whether the sheet is open — drives hydration. */
  open: boolean
  /** Called to close the sheet (on cancel or successful save). */
  onOpenChange: (open: boolean) => void
}

export function useProfileForm({ open, onOpenChange }: UseProfileFormParams) {
  const { user } = useUser()
  const { updateProfile, isPending } = useUpdateProfile()
  const profile = user?.user_profile

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY_VALUES,
    mode: "onBlur",
  })

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  // Hydrate the form with the user's current profile whenever the sheet opens.
  useEffect(() => {
    if (!open || !profile) return
    reset({
      ...EMPTY_VALUES,
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      specialization: profile.specialization ?? "",
      bio: profile.bio ?? "",
    })
  }, [open, profile, reset])

  const onSubmit = handleSubmit((values) => {
    updateProfile(
      {
        full_name: values.full_name.trim(),
        phone: values.phone?.trim() || undefined,
        specialization: values.specialization?.trim() || undefined,
        bio: values.bio?.trim() || undefined,
        ...(values.password ? { password: values.password } : {}),
      },
      { onSuccess: () => onOpenChange(false) }
    )
  })

  return {
    form,
    onSubmit,
    email: user?.email ?? "",
    isPending,
    canSave: isDirty && !isPending,
  }
}
