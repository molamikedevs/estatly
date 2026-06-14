import { PAGE_SIZE } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import type {
  Viewing,
  ViewingStatus,
  ViewingsQueryParams,
} from "@/types/database"
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
    throw new Error("Viewings could not be created")
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
    throw new Error("Viewing status could not be updated")
  }

  return data
}

export async function getViewingsApi({
  filter,
  sortBy,
  page,
  search,
}: ViewingsQueryParams): Promise<{ data: Viewing[]; count: number }> {
  let query = supabase.from("viewings").select(
    `*,
       property:properties!inner(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`,
    { count: "exact" }
  )

  // 1. Filter
  if (filter !== "all") query = query.eq("status", filter)

  // Search
  if (search)
    query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`, {
      referencedTable: "properties",
    })

  // Sort
  query = query.order("scheduled_at", { ascending: sortBy === "soonest" })

  // Paginate
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) {
    throw new Error("Viewings could not be loaded")
  }

  return { data: data ?? [], count: count ?? 0 }
}

export async function deleteViewingApi(id: number): Promise<void> {
  const { error } = await supabase.from("viewings").delete().eq("id", id)

  if (error) {
    throw new Error("Viewing could not be deleted")
  }
}

export async function getRecentViewingsApi(): Promise<Viewing[]> {
  const { data, error } = await supabase
    .from("viewings")
    .select(
      `*,
   property:properties(title, city, main_image),
   client:clients(full_name),
   agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar)`
    )
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    throw new Error("Recent viewings could not be loaded")
  }

  return data ?? []
}
