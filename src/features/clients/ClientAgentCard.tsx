import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import { useClient } from "./useClient"

export default function ClientAgentCard() {
  const { client } = useClient()
  if (!client) return null

  const agentName = client.agent?.full_name || "Unassigned agent"
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        Assigned agent
      </p>
      <div className="mt-3 flex items-center gap-3">
        <UserAvatar
          name={agentName}
          src={client.agent?.avatar ?? undefined}
          size="lg"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{agentName}</p>
          {client.agent?.email && (
            <p className="truncate text-xs text-muted-foreground">
              {client.agent.email}
            </p>
          )}
        </div>
      </div>
      {client.agent?.email && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full gap-2"
        >
          <a href={`mailto:${client.agent.email}`}>
            <Mail className="h-3.5 w-3.5" />
            Send email
          </a>
        </Button>
      )}
    </div>
  )
}
