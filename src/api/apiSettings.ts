import { supabase } from "@/lib/supabase"
import type { Settings } from "@/types/database"
import type { SettingsFormValues } from "@/types/global"

export async function getAgencySettingsApi(): Promise<Settings> {
  const { data, error } = await supabase
    .from("agencies")
    .select("*")
    .limit(1)
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
  return data
}

export async function updateAgencySettingsApi(
  id: number,
  values: SettingsFormValues
): Promise<Settings> {
  const dbReady = {
    name: values.name,
    commission_rate: Number(values.commission_rate),
    default_currency: values.default_currency,
    contact_email: values.contact_email || null,
    contact_phone: values.contact_phone || null,
  }

  const { data, error } = await supabase
    .from("agencies")
    .update(dbReady)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
  return data
}
