import { settingsFormSchema, type SettingsFormValues } from "@/lib/validation"
import type { Settings } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useUpdateSettings } from "./useUpdateSettings"

// Database values (numbers, nulls) → form values (strings)
function toFormValues(settings: Settings): SettingsFormValues {
  return {
    name: settings.name,
    contact_email: settings.contact_email ?? "",
    contact_phone: settings.contact_phone ?? "",
    commission_rate: String(settings.commission_rate ?? ""),
    default_viewing_duration: String(
      settings.default_viewing_duration
    ) as SettingsFormValues["default_viewing_duration"],
  }
}

export function useSettingsForm({ settings }: { settings: Settings }) {
  const { updateSettings, isPending } = useUpdateSettings()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    mode: "onTouched",
    defaultValues: toFormValues(settings),
  })

  const onSubmit = form.handleSubmit((values) => {
    updateSettings(
      { id: settings.id, values },
      // The saved values become the new starting point, so the save bar hides
      { onSuccess: () => form.reset(values) }
    )
  })

  return { form, isPending, onSubmit }
}
