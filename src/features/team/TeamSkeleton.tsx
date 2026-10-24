import { Skeleton } from "@/components/ui/skeleton"
import { SKELETON_KEYS } from "@/lib/constants"

export default function TeamSkeleton() {
  return (
    <div
      role="status"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <span className="sr-only">Loading team</span>
      {SKELETON_KEYS.slice(0, 6).map((key) => (
        <Skeleton key={key} className="h-56 rounded-xl" />
      ))}
    </div>
  )
}
