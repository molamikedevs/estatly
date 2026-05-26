import { supabase } from "@/lib/supabase"
import type { Viewing, ViewingStatus } from "@/types/database"
import type { ViewingFormValues } from "@/types/global"

export async function createViewingApi(
  newViewing: ViewingFormValues
): Promise<Viewing> {
  // agent_id comes from the session, not the form
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Convert form strings to the numbers/types the DB expects
  const dbReady = {
    property_id: Number(newViewing.property_id),
    client_id: Number(newViewing.client_id),
    agent_id: user.id,
    scheduled_at: newViewing.scheduled_at,
    duration_minutes: Number(newViewing.duration_minutes),
    status: newViewing.status,
    notes: newViewing.notes || null,
  }

  const { data, error } = await supabase
    .from("viewings")
    .insert([dbReady])
    .select()
    .single()

  if (error) {
    console.error("createViewingApi error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateViewingStatusApi(
  id: number,
  status: ViewingStatus,
  feedback?: string
): Promise<Viewing> {
  const update: { status: ViewingStatus; feedback?: string } = { status }
  if (feedback !== undefined) update.feedback = feedback

  const { data, error } = await supabase
    .from("viewings")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateViewingStatusApi error:", error)
    throw new Error("Viewing status could not be updated")
  }

  return data
}

export async function getViewingsApi(): Promise<Viewing[]> {
  const { data, error } = await supabase
    .from("viewings")
    .select(
      `*,
       property:properties(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`
    )
    .order("scheduled_at", { ascending: true })

  if (error) {
    console.error("getViewingsApi error:", error)
    throw new Error("Viewings could not be loaded")
  }

  return data ?? []
}

export async function deleteViewingApi(id: number): Promise<void> {
  const { error } = await supabase.from("viewings").delete().eq("id", id)

  if (error) {
    console.error("deleteViewingApi error:", error)
    throw new Error("Viewing could not be deleted")
  }
}
