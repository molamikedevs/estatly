import type { UserFormValues } from "@/types/global"
import { useState } from "react"
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form"

/** Max length of the bio field. */
export const BIO_MAX = 280

/** How close to the limit (in chars remaining) the counter turns "warning". */
const BIO_WARN_THRESHOLD = 20

interface UseProfileFieldsParams {
  control: Control<UserFormValues>
  setValue: UseFormSetValue<UserFormValues>
}

export function useProfileFields({
  control,
  setValue,
}: UseProfileFieldsParams) {
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const bioValue = useWatch({ control, name: "bio" }) ?? ""
  const bioLength = bioValue.length
  const isBioNearLimit = bioLength > BIO_MAX - BIO_WARN_THRESHOLD

  function togglePasswordSection() {
    // Clear password fields when collapsing the section.
    if (showPasswordSection) {
      const opts = { shouldDirty: true, shouldValidate: true }
      setValue("password", "", opts)
      setValue("confirmPassword", "", opts)
    }
    setShowPasswordSection((v) => !v)
  }

  return {
    showPasswordSection,
    togglePasswordSection,
    bio: {
      length: bioLength,
      max: BIO_MAX,
      isNearLimit: isBioNearLimit,
    },
  }
}
