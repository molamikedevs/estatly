import { CalendarClock, SearchX } from "lucide-react"

interface ViewingsEmptyStateProps {
  filtered?: boolean
}

export default function ViewingsEmptyState({
  filtered = false,
}: ViewingsEmptyStateProps) {
  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {filtered ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <CalendarClock className="h-7 w-7" />
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold">
        {filtered ? "No viewings match this filter" : "No viewings scheduled"}
      </h3>

      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {filtered
          ? "Try a different status, or clear the filter to see all viewings."
          : "Property viewing appointments will appear here once they're booked."}
      </p>
    </div>
  )
}
