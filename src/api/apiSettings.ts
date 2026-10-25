import { ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import { settingsSchema, type SettingsFormValues } from "@/lib/validation"
import type { Settings } from "@/types/database"

// The app has one agency, so settings are its single row
export async function getAgencySettingsApi(): Promise<Settings> {
  const { data, error } = await supabase
    .from("agencies")
    .select("*")
    .limit(1)
    .single()

  if (error) throw toRequestError(error, "Settings")
  return data
}

export async function updateAgencySettingsApi({
  id,
  values,
}: {
  id: number
  values: SettingsFormValues
}) {
  const { params } = await action({ params: values, schema: settingsSchema })

  const { data, error } = await supabase
    .from("agencies")
    .update(params)
    .eq("id", id)
    .select("id")

  if (error) throw toRequestError(error, "Settings")

  // RLS lets only admins update; anyone else changes zero rows
  if (data.length === 0) {
    throw new ForbiddenError("Only admins can change settings")
  }
}
