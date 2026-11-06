import { Skeleton } from "@/components/ui/skeleton"
import { SKELETON_KEYS } from "@/lib/constants"

// Same shape as the board, so nothing jumps when the data arrives
export default function ClientsSkeleton() {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">Loading clients</span>

      {/* Phone: the 2x2 stage chips */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {SKELETON_KEYS.slice(0, 4).map((key) => (
          <Skeleton key={key} className="h-10 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SKELETON_KEYS.slice(0, 4).map((key, column) => (
          // Phones only show the first column, like the real board
          <div
            key={key}
            className={column === 0 ? "space-y-3" : "hidden space-y-3 md:block"}
          >
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-44 rounded-lg" />
            <Skeleton className="h-44 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
