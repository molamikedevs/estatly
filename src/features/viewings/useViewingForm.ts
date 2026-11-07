import { useSettings } from "@/features/settings/useSettings"
import { viewingFormSchema, type ViewingFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useCreateViewing } from "./useCreateViewing"

type Duration = ViewingFormValues["duration_minutes"]

interface UseViewingFormParams {
  onClose: () => void
}

export function useViewingForm({ onClose }: UseViewingFormParams) {
  const { createViewing, isPending } = useCreateViewing()
  const { settings } = useSettings()

  const form = useForm<ViewingFormValues>({
    resolver: zodResolver(viewingFormSchema),
    mode: "onTouched",
    defaultValues: {
      property_id: "",
      client_id: "",
      scheduled_at: "",
      duration_minutes: "30",
    },
  })

  // useForm reads defaultValues once, on mount, often before settings load.
  // resetField updates the value and its default, so the form is not dirty.
  const agencyDefault = settings?.default_viewing_duration
  useEffect(() => {
    if (agencyDefault === undefined) return
    form.resetField("duration_minutes", {
      defaultValue: String(agencyDefault) as Duration,
    })
  }, [agencyDefault, form])

  const onSubmit = form.handleSubmit((values) => {
    createViewing(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
