import { settingsSchema } from "@/lib/validation"
import type { Settings } from "@/types/database"
import type { SettingsFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useUpdateSettings } from "./useUpdateSettings"

function settingsToFormValues(s: Settings): SettingsFormValues {
  return {
    name: s.name,
    contact_email: s.contact_email ?? "",
    contact_phone: s.contact_phone ?? "",
    commission_rate: String(s.commission_rate ?? ""),
    default_currency: s.default_currency,
  }
}

export function useSettingsForm({ settings }: { settings: Settings }) {
  const { updateSettings, isPending } = useUpdateSettings()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onBlur",
    defaultValues: settingsToFormValues(settings),
  })

  const onSubmit = form.handleSubmit((values) => {
    updateSettings({ id: settings.id, values })
  })

  return { form, isPending, onSubmit }
}
