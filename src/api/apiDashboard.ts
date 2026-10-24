import { toRequestError } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import type {
  DashboardData,
  DashboardProperty,
  DashboardViewing,
  UserRole,
} from "@/types/database"

import { countByStatus, countOf, DAY_MS } from "@/features/dashboard/constant"

export async function getDashboardApi(
  role: UserRole,
  userId: string
): Promise<DashboardData> {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const inSevenDays = new Date(startOfToday.getTime() + 7 * DAY_MS)

  // Oldest first, so the listing that has waited longest comes first
  let propertiesQuery = supabase
    .from("properties")
    .select(
      "id, title, price, listing_type, status, main_image, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name)"
    )
    .order("created_at", { ascending: true })

  let clientsQuery = supabase.from("clients").select("status")

  let upcomingQuery = supabase
    .from("viewings")
    .select(
      "id, scheduled_at, client_id, property:properties(id, title, main_image), client:clients(full_name)"
    )
    .eq("status", "scheduled")
    .gte("scheduled_at", startOfToday.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(6)

  let nextWeekQuery = supabase
    .from("viewings")
    .select("id", { count: "exact", head: true })
    .eq("status", "scheduled")
    .gte("scheduled_at", startOfToday.toISOString())
    .lt("scheduled_at", inSevenDays.toISOString())

  // Agents see only their own work. RLS enforces the security; these filters set the scope.
  if (role === "agent") {
    propertiesQuery = propertiesQuery.eq("agent_id", userId)
    clientsQuery = clientsQuery.eq("assigned_agent_id", userId)
    upcomingQuery = upcomingQuery.eq("agent_id", userId)
    nextWeekQuery = nextWeekQuery.eq("agent_id", userId)
  }

  const [properties, clients, upcoming, nextWeek] = await Promise.all([
    propertiesQuery,
    clientsQuery,
    upcomingQuery,
    nextWeekQuery,
  ])

  const failed =
    properties.error ?? clients.error ?? upcoming.error ?? nextWeek.error
  if (failed) throw toRequestError(failed, "Dashboard")

  const propertyRows = (properties.data ?? []) as unknown as DashboardProperty[]
  const upcomingRows = (upcoming.data ?? []) as unknown as DashboardViewing[]

  const propertyCounts = countByStatus(propertyRows)
  const clientCounts = countByStatus(clients.data ?? [])

  return {
    propertyCounts,
    clientCounts,
    pending: propertyRows.filter((p) => p.status === "pending-approval"),
    upcoming: upcomingRows,
    stats: {
      listings: propertyRows.length,
      published: countOf(propertyCounts, "published"),
      underOffer: countOf(propertyCounts, "under-offer"),
      activeClients: countOf(clientCounts, "active"),
      viewingsNextWeek: nextWeek.count ?? 0,
    },
  }
}
