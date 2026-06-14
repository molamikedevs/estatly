import { supabase } from "@/lib/supabase"
import type { DashboardStats } from "@/types/database"

export async function getDashboardStatsApi(): Promise<DashboardStats> {
  const properties = supabase.from("properties")
  const viewings = supabase.from("viewings")
  const clients = supabase.from("clients")
  const head = { count: "exact" as const, head: true }

  const nowIso = new Date().toISOString()

  const [
    totalProperties,
    totalViewings,
    published,
    pending,
    underOffer,
    active,
    upcoming,
  ] = await Promise.all([
    properties.select("*", head),
    viewings.select("*", head),
    properties.select("*", head).eq("status", "published"),
    properties.select("*", head).eq("status", "pending-approval"),
    properties.select("*", head).eq("status", "under-offer"),
    clients.select("*", head).eq("status", "active"),
    viewings
      .select("*", head)
      .gte("scheduled_at", nowIso)
      .eq("status", "scheduled"),
  ])

  const results = [
    totalProperties,
    totalViewings,
    pending,
    published,
    underOffer,
    active,
    upcoming,
  ]
  if (results.some((r) => r.error)) {
    console.error(
      "getDashboardStatsApi error:",
      results.find((r) => r.error)?.error
    )
    throw new Error("Dashboard stats could not be loaded")
  }

  return {
    totalProperties: totalProperties.count ?? 0,
    totalViewings: totalViewings.count ?? 0,
    pendingCount: pending.count ?? 0,
    publishedCount: published.count ?? 0,
    underOfferCount: underOffer.count ?? 0,
    activeClients: active.count ?? 0,
    upcomingViewings: upcoming.count ?? 0,
  }
}
