export default function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="shimmer mb-6 h-4 w-36 rounded" />
      <div className="flex h-44 items-end gap-3 px-2">
        {[55, 85, 40].map((h, i) => (
          <div
            key={i}
            className="shimmer flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// export default function ChartSkeleton() {
//   return <div className="shimmer h-[260px] w-full rounded-lg" />;
// }
