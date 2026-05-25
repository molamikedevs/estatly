import { CalendarClock } from "lucide-react"

export default function ViewingsEmptyState() {
  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarClock className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">No viewings scheduled</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Property viewing appointments will appear here once they're booked.
      </p>
    </div>
  )
}
