export default function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="shimmer h-8 w-8 rounded-lg" />
        <div className="shimmer h-3 w-20 rounded" />
      </div>
      <div className="shimmer mt-3 h-7 w-14 rounded" />
      <div className="shimmer mt-2 h-3 w-32 rounded" />
    </div>
  )
}
