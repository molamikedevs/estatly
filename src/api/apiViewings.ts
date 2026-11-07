import { RESCHEDULABLE_STATUSES } from "@/lib/constants"
import { ConflictError, ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { cleanSearch } from "@/lib/helpers"
import { supabase } from "@/lib/supabase"
import {
  rescheduleViewingSchema,
  updateViewingStatusSchema,
  viewingSchema,
  type RescheduleFormValues,
  type ViewingFormValues,
} from "@/lib/validation"
import type {
  Client,
  Property,
  PropertyStatus,
  Viewing,
  ViewingStatus,
  ViewingsQueryParams,
} from "@/types/database"

// Listings a client can still visit: not sold, rented or waiting for approval
const BOOKABLE_STATUSES: PropertyStatus[] = ["published", "under-offer"]

// For the property picker in the viewing form
export async function getBookablePropertiesApi(): Promise<
  Pick<Property, "id" | "title">[]
> {
  const { data, error } = await supabase
    .from("properties")
    .select("id, title")
    .in("status", BOOKABLE_STATUSES)
    .order("title")

  if (error) throw toRequestError(error, "Properties")
  return data ?? []
}

// For the client picker: only clients still looking. Agents get their own (RLS)
export async function getActiveClientsApi(): Promise<
  Pick<Client, "id" | "full_name">[]
> {
  const { data, error } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("status", "active")
    .order("full_name")

  if (error) throw toRequestError(error, "Clients")
  return data ?? []
}

export async function createViewingApi(values: ViewingFormValues) {
  // Schema turns form strings into numbers; agent_id comes from the session
  const { params, user } = await action({
    params: values,
    schema: viewingSchema,
    authorize: true,
  })

  const { error } = await supabase
    .from("viewings")
    .insert({ ...params, agent_id: user!.id, status: "scheduled" })

  if (error) throw toRequestError(error, "Viewing")
}

export async function rescheduleViewingApi(
  values: RescheduleFormValues & { id: number }
) {
  const { params } = await action({
    params: values,
    schema: rescheduleViewingSchema,
  })

  const { data, error } = await supabase
    .from("viewings")
    .update({
      scheduled_at: params.scheduled_at,
      duration_minutes: params.duration_minutes,
      status: "scheduled",
    })
    .eq("id", params.id)
    // The server enforces the rule, not just the menu
    .in("status", RESCHEDULABLE_STATUSES)
    .select("id")

  if (error) throw toRequestError(error, "Viewing")

  // Zero rows: wrong status, or RLS blocked it (not your viewing)
  if (data.length === 0) {
    throw new ConflictError(
      "Only your own scheduled or no-show viewings can be rescheduled"
    )
  }
}

export async function updateViewingStatusApi(values: {
  id: number
  status: ViewingStatus
}) {
  const { params } = await action({
    params: values,
    schema: updateViewingStatusSchema,
  })

  const { data, error } = await supabase
    .from("viewings")
    .update({ status: params.status })
    .eq("id", params.id)
    .select("id")

  if (error) throw toRequestError(error, "Viewing")

  // RLS blocks updates silently: no error, zero rows changed
  if (data.length === 0) {
    throw new ForbiddenError("You can only update your own viewings")
  }
}

export async function getViewingsApi({
  filter,
  sortBy,
  page,
  search,
  pageSize,
}: ViewingsQueryParams): Promise<{ data: Viewing[]; count: number }> {
  // !inner: a viewing whose property does not match the search is dropped,
  // instead of coming back with property: null
  let query = supabase.from("viewings").select(
    `*,
       property:properties!inner(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`,
    { count: "exact" }
  )

  if (filter !== "all") query = query.eq("status", filter)

  // Search on the joined property; cleaned so input cannot become filter syntax
  const term = cleanSearch(search)
  if (term)
    query = query.or(`title.ilike.%${term}%,city.ilike.%${term}%`, {
      referencedTable: "properties",
    })

  query = query.order("scheduled_at", { ascending: sortBy === "soonest" })

  // One page of rows plus the total, for the pagination
  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) throw toRequestError(error, "Viewings")

  return { data: data ?? [], count: count ?? 0 }
}

export async function deleteViewingApi(id: number) {
  // Only viewings that have not happened yet. Anything else gets a status.
  const { data, error } = await supabase
    .from("viewings")
    .delete()
    .eq("id", id)
    .eq("status", "scheduled")
    .select("id")

  if (error) throw toRequestError(error, "Viewing")

  // Zero rows: not scheduled, or RLS blocked it (not your viewing)
  if (data.length === 0) {
    throw new ConflictError(
      "Only your own scheduled viewings can be deleted. Set a status instead."
    )
  }
}
