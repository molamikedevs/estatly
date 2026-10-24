import { RESCHEDULABLE_STATUSES } from "@/lib/constants"
import { ConflictError, ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import {
  rescheduleViewingSchema,
  updateViewingStatusSchema,
  viewingSchema,
  type RescheduleFormValues,
  type ViewingFormValues,
} from "@/lib/validation"
import type {
  Viewing,
  ViewingStatus,
  ViewingsQueryParams,
} from "@/types/database"

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
  let query = supabase.from("viewings").select(
    `*,
       property:properties!inner(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`,
    { count: "exact" }
  )

  // Filter
  if (filter !== "all") query = query.eq("status", filter)

  // Search on the joined property
  if (search)
    query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`, {
      referencedTable: "properties",
    })

  // Sort
  query = query.order("scheduled_at", { ascending: sortBy === "soonest" })

  // Paginate
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

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
