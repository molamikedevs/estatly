import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/features/auth/useUser"
import { can } from "@/lib/permissions"
import type { Client } from "@/types/database"
import { Mail, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react"
import ClientStatusBadge from "./ClientStatusBadge"

interface ClientDetailHeaderProps {
  client: Client
  onEdit?: (client: Client) => void
  onDelete?: (client: Client) => void
}

export default function ClientDetailHeader({
  client,
  onEdit,
  onDelete,
}: ClientDetailHeaderProps) {
  const { user } = useUser()
  const role = user?.user_profile?.role

  // Agent can edit/delete only their own; managers/admins can any
  const isOwner = client.assigned_agent_id === user?.id
  const canEdit = role
    ? can.editAnyClient(role) || (role === "agent" && isOwner)
    : false
  const canDelete = role
    ? can.deleteClient(role) || (role === "agent" && isOwner)
    : false

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ClientStatusBadge status={client.status} />

        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 shadow-sm backdrop-blur-sm transition-colors data-[state=open]:bg-muted"
                aria-label="Client actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {canEdit && onEdit && (
                <>
                  <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Manage
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onEdit(client)}
                    className="gap-2 text-sm"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    Edit details
                  </DropdownMenuItem>
                </>
              )}

              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(client)}
                    className="gap-2 text-sm text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete client
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">
        {client.full_name}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {client.email}
        </span>
        {client.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {client.phone}
          </span>
        )}
      </div>
    </div>
  )
}
