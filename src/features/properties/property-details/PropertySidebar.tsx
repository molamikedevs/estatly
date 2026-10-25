import UserAvatar from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/helpers"
import type { Property } from "@/types/database"
import { Mail } from "lucide-react"
import PropertyPrice from "../PropertyPrice"

export default function PropertySidebar({ property }: { property: Property }) {
  const isRent = property.listing_type === "rent"
  const agent = property.agent
  const agentName = agent?.full_name || "Unassigned agent"
  const views = property.views_count ?? 0
  const mailto = agent?.email
    ? `mailto:${agent.email}?subject=${encodeURIComponent(property.title)}`
    : null

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">
          {isRent ? "Yearly rent" : "Asking price"}
        </p>
        <PropertyPrice property={property} className="mt-1 text-4xl" />

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <UserAvatar name={agentName} src={agent?.avatar} size="md" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Listed by</p>
            <p className="truncate text-sm font-semibold">{agentName}</p>
            {agent?.email && (
              <p className="truncate text-xs text-muted-foreground">
                {agent.email}
              </p>
            )}
          </div>
        </div>

        {mailto ? (
          <Button asChild size="lg" className="mt-4 h-11 w-full gap-2">
            <a href={mailto}>
              <Mail className="h-4 w-4" />
              Email {agent?.full_name?.split(" ")[0] ?? "agent"}
            </a>
          </Button>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No agent is assigned to this listing yet.
          </p>
        )}

        <p className="mt-5 text-xs text-muted-foreground">
          Listed {formatDate(property.created_at)}. Viewed{" "}
          <span className="tabular">{views}</span>{" "}
          {views === 1 ? "time" : "times"}.
        </p>
      </div>
    </aside>
  )
}
