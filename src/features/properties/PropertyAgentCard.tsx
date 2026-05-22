import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/helpers"
import { useProperty } from "./useProperty"

export default function PropertyAgentCard() {
  const { property } = useProperty()
  if (!property) return

  const agentName = property?.agent?.full_name || "Unassigned agent"
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        Listing agent
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-card">
          <AvatarImage
            src={property.agent?.avatar ?? undefined}
            alt={agentName}
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
            {getInitials(agentName) || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{agentName}</p>
          {property.agent?.email && (
            <p className="truncate text-xs text-muted-foreground">
              {property.agent.email}
            </p>
          )}
        </div>
      </div>
      {property.agent?.email && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full gap-2"
        >
          <a href={`mailto:${property.agent.email}`}>
            <Mail className="h-3.5 w-3.5" />
            Send email
          </a>
        </Button>
      )}
    </div>
  )
}
