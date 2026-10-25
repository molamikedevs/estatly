import { useSettings } from "@/features/settings/useSettings"
import { viewingFormSchema, type ViewingFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateViewing } from "./useCreateViewing"

interface UseViewingFormParams {
  onClose: () => void
}

export function useViewingForm({ onClose }: UseViewingFormParams) {
  const { createViewing, isPending } = useCreateViewing()
  const { settings } = useSettings()

  // Agency default from Settings; 30 minutes until settings have loaded
  const defaultDuration = String(
    settings?.default_viewing_duration ?? 30
  ) as ViewingFormValues["duration_minutes"]

  const form = useForm<ViewingFormValues>({
    // Form checks the rules on strings; the API converts them with viewingSchema
    resolver: zodResolver(viewingFormSchema),
    // Errors after a field is first left, then live while fixing it
    mode: "onTouched",
    defaultValues: {
      property_id: "",
      client_id: "",
      scheduled_at: "",
      duration_minutes: defaultDuration,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createViewing(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
