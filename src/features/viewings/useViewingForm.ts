import { viewingFormSchema, type ViewingFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateViewing } from "./useCreateViewing"

const EMPTY_VALUES: ViewingFormValues = {
  property_id: "",
  client_id: "",
  scheduled_at: "",
  duration_minutes: "30",
}

interface UseViewingFormParams {
  onClose: () => void
}

export function useViewingForm({ onClose }: UseViewingFormParams) {
  const { createViewing, isPending } = useCreateViewing()

  const form = useForm<ViewingFormValues>({
    // Form checks the rules on strings; the API converts them with viewingSchema
    resolver: zodResolver(viewingFormSchema),
    // Errors after a field is first left, then live while fixing it
    mode: "onTouched",
    defaultValues: EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    createViewing(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
