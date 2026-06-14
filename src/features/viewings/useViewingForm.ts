import { viewingSchema } from "@/lib/validation"
import type { ViewingFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateViewing } from "./useCreateViewing"

const EMPTY_VALUES: ViewingFormValues = {
  property_id: "",
  client_id: "",
  scheduled_at: "",
  duration_minutes: "30",
  status: "scheduled",
  notes: "",
}

interface UseViewingFormParams {
  onClose: () => void
}

export function useViewingForm({ onClose }: UseViewingFormParams) {
  const { createViewing, isPending } = useCreateViewing()

  const form = useForm<ViewingFormValues>({
    resolver: zodResolver(viewingSchema),
    mode: "onBlur",
    defaultValues: EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    createViewing(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
