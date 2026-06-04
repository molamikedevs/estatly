export default function ManagerCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="shimmer h-11 w-11 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3.5 w-32 rounded" />
          <div className="shimmer h-3 w-24 rounded" />
        </div>
        <div className="shimmer h-5 w-12 shrink-0 rounded-full" />
      </div>
      <div className="mt-3.5 space-y-2 border-t border-border/60 pt-3">
        <div className="shimmer h-3 w-40 rounded" />
        <div className="shimmer h-3 w-28 rounded" />
      </div>
    </div>
  )
}
