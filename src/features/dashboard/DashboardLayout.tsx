import { useClientsByStage } from "@/features/clients/useClientsByStage"
import { usePropertiesByStatus } from "@/features/properties/usePropertiesByStatus"
import { useRecentViewings } from "@/features/viewings/useRecentViewings"
import { Building2, CalendarClock, Handshake, Users } from "lucide-react"
import { Link } from "react-router-dom"
import ChartSkeleton from "./ChartSkeleton"
import ClientsPipelineChart from "./ClientsPipelineChart"
import PropertiesStatusChart from "./PropertiesStatusChart"
import RecentViewings from "./RecentViewings"
import RecentViewingsSkeleton from "./RecentViewingsSkeleton"
import StatCard from "./StatCard"
import StatCardSkeleton from "./StatCardSkeleton"
import { useDashboard } from "./useDashboard"

export default function DashboardLayout() {
  const { recentViewings, isLoading: loadingViewings } = useRecentViewings()
  const { isLoading: loadingClients, clientsByStage } = useClientsByStage()
  const { propertiesByStatus, isLoading: loadingProperties } =
    usePropertiesByStatus()

  const { stats, isLoading: loadingStats } = useDashboard()
  const {
    totalProperties = 0,
    pendingCount = 0,
    publishedCount = 0,
    underOfferCount = 0,
    activeClients = 0,
    upcomingViewings = 0,
  } = stats || {}

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your agency at a glance
        </p>
      </div>

      {/* ── Stat cards — each gated by its own source ────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loadingStats ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            icon={Building2}
            label="Properties"
            value={totalProperties}
            subtitle={`${publishedCount} published · ${pendingCount} pending`}
            tone="primary"
          />
        )}

        {loadingStats ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            icon={Users}
            label="Active clients"
            value={activeClients}
            subtitle="In active pipeline"
            tone="info"
          />
        )}

        {loadingStats ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            icon={Handshake}
            label="Under offer"
            value={underOfferCount}
            subtitle="Awaiting decision"
            tone="warning"
          />
        )}

        {loadingStats ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            icon={CalendarClock}
            label="Upcoming viewings"
            value={upcomingViewings}
            subtitle="Scheduled ahead"
            tone="success"
          />
        )}
      </div>

      {/* ── Charts ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">Properties by status</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Distribution across the listing lifecycle
            </p>
          </div>
          {loadingProperties ? (
            <ChartSkeleton />
          ) : (
            <PropertiesStatusChart
              data={propertiesByStatus.map((item) => ({
                ...item,
                label: item.status,
              }))}
            />
          )}
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">Client pipeline</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Breakdown by stage
            </p>
          </div>
          {loadingClients ? (
            <ChartSkeleton />
          ) : (
            <ClientsPipelineChart
              data={clientsByStage.map((item) => ({
                ...item,
                label: item.status,
              }))}
            />
          )}
        </section>
      </div>

      {/* ── Recent viewings ─────────────────────────────── */}
      <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Recent viewings</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Latest scheduled appointments
            </p>
          </div>
          {!loadingViewings && recentViewings.length > 0 && (
            <Link
              to="/viewings"
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          )}
        </div>

        {loadingViewings ? (
          <RecentViewingsSkeleton />
        ) : (
          <RecentViewings viewings={recentViewings} />
        )}
      </section>
    </div>
  )
}
