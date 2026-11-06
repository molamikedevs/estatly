import { Skeleton } from "@/components/ui/skeleton"

// Same shape as the real dashboard, so nothing jumps when data arrives
export default function DashboardSkeleton({ isAgent }: { isAgent: boolean }) {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">Loading dashboard</span>

      {/* Agents get one top panel, everyone else gets two */}
      {isAgent ? (
        <Skeleton className="h-72 rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      )}

      <Skeleton className="h-20 rounded-xl" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}
