import { supabase } from "@/lib/supabase"
import type { Client, ClientStatus } from "@/types/database"
import type { ClientFormValues } from "@/types/global"

export async function createClientApi(
  newClient: ClientFormValues
): Promise<Client> {
  // assigned_agent_id comes from the session — the creator owns this lead
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const dbReady = {
    full_name: newClient.full_name,
    email: newClient.email,
    phone: newClient.phone || null,
    nationality: newClient.nationality || null,
    budget_min: newClient.budget_min ? Number(newClient.budget_min) : null,
    budget_max: newClient.budget_max ? Number(newClient.budget_max) : null,
    preferred_type: newClient.preferred_type || null,
    preferred_locations: newClient.preferred_locations,
    notes: newClient.notes || null,
    status: newClient.status,
    assigned_agent_id: user.id,
  }

  const { data, error } = await supabase
    .from("clients")
    .insert([dbReady])
    .select()
    .single()

  if (error) {
    console.error("createClientApi error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateClientStatusApi(
  id: number,
  status: ClientStatus
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateClientStatusApi error:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getClientsApi(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "*, agent:user_profiles!clients_assigned_agent_id_user_profiles_fkey(full_name, avatar, email)"
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getClientsApi error:", error)
    throw new Error("Clients could not be loaded")
  }

  return data ?? []
}

export async function deleteClientApi(id: number): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    console.error("deleteClientApi error:", error)
    throw new Error("Client could not be deleted")
  }
}
