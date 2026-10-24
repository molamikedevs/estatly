import { Skeleton } from "@/components/ui/skeleton"
import { SKELETON_KEYS } from "@/lib/constants"

export default function ViewingsSkeleton() {
  return (
    <div role="status" className="overflow-hidden rounded-xl border bg-card">
      <span className="sr-only">Loading viewings</span>
      <ul className="divide-y">
        {SKELETON_KEYS.slice(0, 6).map((key) => (
          <li key={key} className="flex items-center gap-3 p-4">
            <Skeleton className="size-11 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
