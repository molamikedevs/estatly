import { Skeleton } from "@/components/ui/skeleton"
import { SKELETON_KEYS } from "@/lib/constants"

export default function ClientsSkeleton() {
  return (
    <div
      role="status"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <span className="sr-only">Loading clients</span>
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
  )
}
