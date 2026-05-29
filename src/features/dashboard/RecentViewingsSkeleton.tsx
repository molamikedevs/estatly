export default function RecentViewingsSkeleton() {
  return (
    <ul className="divide-y divide-border/60">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="shimmer h-10 w-12 shrink-0 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <div className="shimmer h-3.5 w-44 max-w-full rounded" />
            <div className="shimmer h-3 w-32 max-w-full rounded" />
          </div>
          <div className="shimmer h-5 w-16 rounded-full" />
        </li>
      ))}
    </ul>
  )
}
