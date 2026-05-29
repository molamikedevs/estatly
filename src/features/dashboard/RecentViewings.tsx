import type { Viewing } from "@/types/database"
import { CalendarClock } from "lucide-react"
import ViewingItem from "./ViewingItem"

export default function RecentViewings({ viewings }: { viewings: Viewing[] }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Recent viewings</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest scheduled appointments
          </p>
        </div>
      </div>

      {viewings.length === 0 ? (
        <div className="pattern-dots flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarClock className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium">No viewings yet</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Scheduled appointments will appear here
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {viewings.map((v) => (
            <ViewingItem key={v.id} viewing={v} />
          ))}
        </ul>
      )}
    </section>
  )
}
