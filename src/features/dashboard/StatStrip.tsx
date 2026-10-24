interface StatItem {
  label: string
  value: number
}

export default function StatStrip({ items }: { items: StatItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-card px-4 py-3">
          <dt className="truncate text-sm text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
