import { useClients } from "@/features/clients/useClients"
import { useProperties } from "@/features/properties/useProperties"
import { useViewings } from "@/features/viewings/useViewings"

export function useDashboard() {
  const { properties, isLoading: loadingProperties } = useProperties()
  const { viewings, isLoading: loadingViewings } = useViewings()
  const { clients, isLoading: loadingClients } = useClients()

  const props = properties ?? []
  const views = viewings ?? []
  const clis = clients ?? []
  const now = new Date()

  // ── Stat card numbers ─────────────────────────
  const totalProperties = props.length
  const publishedCount = props.filter((p) => p.status === "published").length
  const pendingCount = props.filter(
    (p) => p.status === "pending-approval"
  ).length
  const underOfferCount = props.filter((p) => p.status === "under-offer").length

  const activeClients = clis.filter((c) => c.status === "active").length

  const upcomingViewings = views.filter(
    (v) => new Date(v.scheduled_at) >= now && v.status === "scheduled"
  ).length

  // ── Chart 1: properties by status ─────────────
  const statusOrder = [
    "pending-approval",
    "published",
    "under-offer",
    "sold",
    "rented",
  ] as const

  const propertiesByStatus = statusOrder
    .map((status) => ({
      status,
      label: status.replace("-", " "),
      count: props.filter((p) => p.status === status).length,
    }))
    .filter((row) => row.count > 0) // skip empty statuses

  // ── Chart 2: clients by pipeline stage ────────
  const clientStages = [
    "active",
    "closed-won",
    "closed-lost",
    "inactive",
  ] as const

  const clientsByStage = clientStages
    .map((status) => ({
      status,
      label: status.replace("-", " "),
      count: clis.filter((c) => c.status === status).length,
    }))
    .filter((row) => row.count > 0)

  // ── Recent activity: latest 5 viewings ────────
  const recentViewings = [...views]
    .sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    )
    .slice(0, 5)

  return {
    // per-source flags
    loadingProperties,
    loadingViewings,
    loadingClients,
    // and a derived "all" flag for headers / stats that mix sources
    isAnyLoading: loadingProperties || loadingViewings || loadingClients,

    stats: {
      totalProperties,
      publishedCount,
      pendingCount,
      underOfferCount,
      activeClients,
      upcomingViewings,
    },
    propertiesByStatus,
    clientsByStage,
    recentViewings,
  }
}
