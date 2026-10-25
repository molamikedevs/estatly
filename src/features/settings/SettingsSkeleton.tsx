import { Skeleton } from "@/components/ui/skeleton"
import { SKELETON_KEYS } from "@/lib/constants"

export default function SettingsSkeleton() {
  return (
    <div role="status" className="divide-y rounded-xl border bg-card">
      <span className="sr-only">Loading settings</span>
      {SKELETON_KEYS.slice(0, 3).map((key) => (
        <div
          key={key}
          className="grid gap-4 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-10" />
        </div>
      ))}
    </div>
  )
}
