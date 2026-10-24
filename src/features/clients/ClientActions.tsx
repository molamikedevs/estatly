import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Client, ClientStatus } from "@/types/database"

import { CLIENT_STAGES } from "@/lib/constants"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface ClientCardProps {
  client: Client
  showAgent: boolean
  onEdit: () => void
  onMove: (status: ClientStatus) => void
  onDelete: () => void
}

export default function ClientActions({
  client,
  onEdit,
  onMove,
  onDelete,
}: Omit<ClientCardProps, "showAgent">) {
  // Clients with viewings are records: close them with a stage, not a delete
  const canDelete = client.viewing_count === 0
  const otherStages = CLIENT_STAGES.filter((s) => s.status !== client.status)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-mt-1 -mr-2 size-9 shrink-0 text-muted-foreground"
          aria-label={`Actions for ${client.full_name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Move to</DropdownMenuLabel>
        {otherStages.map((stage) => (
          <DropdownMenuItem
            key={stage.status}
            onSelect={() => onMove(stage.status)}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            {stage.label}
          </DropdownMenuItem>
        ))}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
