export default function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* ── Header card ───────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        {/* cover */}
        <div className="shimmer h-32" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="shimmer h-24 w-24 rounded-full ring-4 ring-card" />
              <div className="space-y-2 sm:pb-1">
                <div className="shimmer h-6 w-44 rounded" />
                <div className="shimmer h-4 w-56 rounded" />
              </div>
            </div>
            <div className="shimmer h-9 w-28 rounded-md sm:mb-1" />
          </div>
          {/* badges */}
          <div className="mt-5 flex gap-2">
            <div className="shimmer h-6 w-20 rounded-full" />
            <div className="shimmer h-6 w-20 rounded-full" />
            <div className="shimmer h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── About card ────────────────────────────── */}
      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-5 space-y-2">
          <div className="shimmer h-5 w-24 rounded" />
          <div className="shimmer h-3 w-64 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3.5"
            >
              <div className="shimmer h-9 w-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-2.5 w-20 rounded" />
                <div className="shimmer h-3.5 w-32 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity card ─────────────────────────── */}
      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-5 space-y-2">
          <div className="shimmer h-5 w-36 rounded" />
          <div className="shimmer h-3 w-56 rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="shimmer h-4 w-4 rounded" />
                <div className="shimmer h-3.5 w-28 rounded" />
              </div>
              <div className="shimmer h-3.5 w-32 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
