import UserAvatar from "@/components/common/UserAvatar"
import { propertyTypes } from "@/lib/constants"
import { formatBudgetRange } from "@/lib/helpers"
import type { Client, ClientStatus } from "@/types/database"
import { Mail, Phone } from "lucide-react"
import ClientActions from "./ClientActions"

interface ClientCardProps {
  client: Client
  showAgent: boolean
  onEdit: () => void
  onMove: (status: ClientStatus) => void
  onDelete: () => void
}

// "Penthouse · Downtown Dubai, DIFC"
function describeWants(client: Client) {
  const type = propertyTypes.find(
    (t) => t.value === client.preferred_type
  )?.label
  const areas = (client.preferred_locations ?? []).join(", ")
  return [type, areas].filter(Boolean).join(" · ") || "No preferences yet"
}

export default function ClientCard({
  client,
  showAgent,
  onEdit,
  onMove,
  onDelete,
}: ClientCardProps) {
  const viewings = client.viewing_count
  const viewingsLabel =
    viewings === 0
      ? "No viewings"
      : `${viewings} viewing${viewings === 1 ? "" : "s"}`

  return (
    <article className="rounded-lg border bg-card p-4">
      {/* Who */}
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{client.full_name}</h3>
          {client.nationality && (
            <p className="truncate text-sm text-muted-foreground">
              {client.nationality}
            </p>
          )}
        </div>
        <ClientActions
          client={client}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      </div>

      {/* What they want */}
      <dl className="mt-3 space-y-1 text-sm">
        <dt className="sr-only">Looking for</dt>
        <dd className="truncate">{describeWants(client)}</dd>
        <dt className="sr-only">Budget</dt>
        <dd className="font-medium text-highlight tabular-nums">
          {formatBudgetRange(client.budget_min, client.budget_max)}
        </dd>
      </dl>

      {/* Tap to contact */}
      <div className="mt-3 flex flex-col text-sm">
        <a
          href={`mailto:${client.email}`}
          className="flex min-h-9 items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Mail className="size-4 shrink-0" />
          <span className="truncate">{client.email}</span>
        </a>
        {client.phone && (
          <a
            href={`tel:${client.phone.replace(/\s/g, "")}`}
            className="flex min-h-9 items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Phone className="size-4 shrink-0" />
            <span className="truncate tabular-nums">{client.phone}</span>
          </a>
        )}
      </div>

      {/* Owner and activity */}
      <div className="mt-2 flex items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
        {showAgent ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar
              name={client.agent?.full_name}
              src={client.agent?.avatar}
              size="xs"
            />
            <span className="truncate">
              {client.agent?.full_name ?? "No agent"}
            </span>
          </span>
        ) : (
          <span />
        )}
        <span className="shrink-0 tabular-nums">{viewingsLabel}</span>
      </div>
    </article>
  )
}
