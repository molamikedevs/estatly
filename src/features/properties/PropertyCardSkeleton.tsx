export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-card">
      <div className="shimmer aspect-[16/10] w-full" />
      <div className="space-y-2 p-3.5">
        <div className="shimmer h-4 w-1/3 rounded" />
        <div className="shimmer h-3.5 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="flex gap-3 border-t border-border/60 pt-2.5">
          <div className="shimmer h-3 w-7 rounded" />
          <div className="shimmer h-3 w-7 rounded" />
          <div className="shimmer h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  )
}
