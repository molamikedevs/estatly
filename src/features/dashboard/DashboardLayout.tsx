import ErrorMessage from "@/components/common/ErrorMessage"
import PageHeader from "@/components/PageHeader"
import { EMPTY_CLIENTS_BY_STAGE, EMPTY_LISTINGS_BY_STATUS } from "@/lib/states"
import { Link } from "react-router-dom"
import { CLIENT_STAGES, PROPERTY_STATUSES } from "./constant"
import DashboardSkeleton from "./DashboardSkeleton"
import Panel from "./Panel"
import PendingList from "./PendingList"
import StatStrip from "./StatStrip"
import StatusBars from "./StatusBars"
import { useDashboard } from "./useDashboard"
import ViewingList from "./ViewingList"

const viewAllLink = (
  <Link
    to="/viewings"
    className="shrink-0 text-sm font-medium text-primary hover:underline"
  >
    View all
  </Link>
)

export default function DashboardLayout() {
  const { dashboard, isLoading, error, refetch, role } = useDashboard()
  const isAgent = role === "agent"

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Dashboard"
        subText={
          isAgent ? "Your listings, clients and viewings" : "Agency overview"
        }
      />

      {isLoading && <DashboardSkeleton />}

      {error && <ErrorMessage error={error} onRetry={() => refetch()} />}

      {dashboard && (
        <>
          {/* 1. What needs action first */}
          {isAgent ? (
            <Panel title="Your viewings" action={viewAllLink}>
              <ViewingList viewings={dashboard.upcoming} />
            </Panel>
          ) : (
            // minmax(0, …): columns may shrink below their longest text
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Panel
                title="Waiting for approval"
                count={dashboard.pending.length}
              >
                <PendingList properties={dashboard.pending} />
              </Panel>
              <Panel title="Next viewings" action={viewAllLink}>
                <ViewingList viewings={dashboard.upcoming} />
              </Panel>
            </div>
          )}

          {/* 2. Context numbers, kept small */}
          <StatStrip
            items={[
              isAgent
                ? { label: "Your listings", value: dashboard.stats.listings }
                : { label: "Published", value: dashboard.stats.published },
              { label: "Under offer", value: dashboard.stats.underOffer },
              { label: "Active clients", value: dashboard.stats.activeClients },
              {
                label: "Viewings, next 7 days",
                value: dashboard.stats.viewingsNextWeek,
              },
            ]}
          />

          {/* 3. Breakdown */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Panel
              title={isAgent ? "Your listings by status" : "Listings by status"}
              count={dashboard.stats.listings}
            >
              <StatusBars
                config={PROPERTY_STATUSES}
                counts={dashboard.propertyCounts}
                empty={EMPTY_LISTINGS_BY_STATUS}
              />
            </Panel>
            <Panel
              title={isAgent ? "Your clients by stage" : "Clients by stage"}
            >
              <StatusBars
                config={CLIENT_STAGES}
                counts={dashboard.clientCounts}
                empty={EMPTY_CLIENTS_BY_STAGE}
              />
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}
