import { useUpdateProfile } from "@/features/auth/useUpdateProfile"
import { useUser } from "@/features/auth/useUser"
import { profileSchema } from "@/lib/validation"
import type { UserFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const EMPTY_VALUES: UserFormValues = {
  full_name: "",
  phone: "",
  specialization: "",
  bio: "",
  password: "",
  confirmPassword: "",
}

interface UseUserProfileFormParams {
  onOpenChange: (open: boolean) => void
}

export function useUserProfileForm({ onOpenChange }: UseUserProfileFormParams) {
  const { user } = useUser()
  const { updateProfile, isPending } = useUpdateProfile()
  const profile = user?.user_profile

  const form = useForm<UserFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: profile
      ? {
          ...EMPTY_VALUES,
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          specialization: profile.specialization ?? "",
          bio: profile.bio ?? "",
        }
      : EMPTY_VALUES,
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = form

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
