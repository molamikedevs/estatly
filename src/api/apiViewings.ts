import action from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import { supabase } from "@/lib/supabase"
import { ViewingsQuerySchema } from "@/lib/validation"
import type {
  Viewing,
  ViewingStatus,
  ViewingsQueryParams,
} from "@/types/database"
import type { ActionResponse, ViewingFormValues } from "@/types/global"

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

export async function getViewingsApi(
  params: ViewingsQueryParams
): Promise<ActionResponse<{ viewings: Viewing[]; count: number }>> {
  const validationResult = await action({ params, schema: ViewingsQuerySchema })
  if (validationResult instanceof Error) {
    return handleError(validationResult)
  }

  const {
    page = 1,
    page_size = 10,
    query,
    filter,
    sort_by,
  } = validationResult.params!

  const from = (page - 1) * page_size
  const to = from + page_size - 1

  try {
    let supabaseQuery = supabase.from("viewings").select(
      `*,
       property:properties!inner(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`,
      { count: "exact" }
    )

    // 1. Filter
    if (filter !== "all") supabaseQuery = supabaseQuery.eq("status", filter)

    // Search
    if (query)
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,city.ilike.%${query}%`,
        {
          referencedTable: "properties",
        }
      )

    // Sort
    supabaseQuery = supabaseQuery.order("scheduled_at", {
      ascending: sort_by === "soonest",
    })

    // Paginate
    supabaseQuery = supabaseQuery.range(from, to)

    const { data, error, count } = await supabaseQuery
    if (error) {
      throw new Error("Viewings could not be loaded")
    }

    const viewings = data ?? []
    const total = count ?? 0

    return {
      success: true,
      data: { viewings: viewings as Viewing[], count: total },
    }
  } catch (error) {
    return handleError(error)
  }
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
