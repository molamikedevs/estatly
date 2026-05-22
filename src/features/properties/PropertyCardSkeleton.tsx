export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-card">
      <div className="shimmer aspect-[4/3] w-full" />
      <div className="space-y-2.5 p-4">
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="shimmer h-5 w-1/3 rounded" />
        <div className="flex gap-3 border-t border-border/60 pt-3">
          <div className="shimmer h-3 w-10 rounded" />
          <div className="shimmer h-3 w-10 rounded" />
          <div className="shimmer h-3 w-14 rounded" />
        </div>
      </div>
    </div>
  )
}
