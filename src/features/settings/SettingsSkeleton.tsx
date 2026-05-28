export default function SettingsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 space-y-2">
        <div className="shimmer h-7 w-32 rounded" />
        <div className="shimmer h-4 w-72 max-w-full rounded" />
      </div>

      {Array.from({ length: 2 }).map((_, s) => (
        <div
          key={s}
          className="mb-6 rounded-2xl border bg-card p-5 shadow-card sm:p-6"
        >
          <div className="mb-5 space-y-2">
            <div className="shimmer h-5 w-40 rounded" />
            <div className="shimmer h-3 w-56 max-w-full rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, r) => (
              <div
                key={r}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div className="shimmer h-3 w-28 rounded" />
                <div className="shimmer h-4 w-40 max-w-[50%] rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
