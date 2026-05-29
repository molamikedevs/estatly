export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="shimmer h-7 w-40 rounded" />
        <div className="shimmer h-4 w-72 max-w-full rounded" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card p-4 shadow-card sm:p-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="shimmer h-8 w-8 rounded-lg" />
              <div className="shimmer h-3 w-20 rounded" />
            </div>
            <div className="shimmer mt-3 h-7 w-14 rounded" />
            <div className="shimmer mt-2 h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <div className="shimmer mb-2 h-4 w-40 rounded" />
          <div className="shimmer mb-5 h-3 w-56 rounded" />
          <div className="shimmer h-[260px] w-full rounded-lg" />
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <div className="shimmer mb-2 h-4 w-32 rounded" />
          <div className="shimmer mb-5 h-3 w-44 rounded" />
          <div className="shimmer h-[260px] w-full rounded-lg" />
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="shimmer mb-2 h-4 w-36 rounded" />
        <div className="shimmer mb-5 h-3 w-48 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="shimmer h-10 w-12 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <div className="shimmer h-3.5 w-44 rounded" />
                <div className="shimmer h-3 w-32 rounded" />
              </div>
              <div className="shimmer h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
