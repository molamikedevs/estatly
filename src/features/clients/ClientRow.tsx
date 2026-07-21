import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import UserAvatar from "@/components/UserAvatar"
import { useUser } from "@/features/auth/useUser"
import { can } from "@/lib/permissions"
import type { Client, ClientStatus } from "@/types/database"
import {
  CheckCircle,
  Circle,
  Mail,
  MinusCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import BudgetRange from "./BudgetRange"

interface ClientRowProps {
  client: Client
  budgetCeiling: number
  onEdit?: (client: Client) => void
  onStatusChange?: (client: Client, status: ClientStatus) => void
  onDelete?: (client: Client) => void
}

export default function ClientRow({
  client,
  budgetCeiling,
  onEdit,
  onDelete,
  onStatusChange,
}: ClientRowProps) {
  const { agent } = client
  const navigate = useNavigate()
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

  function goToDetail() {
    navigate(`/clients/${client.id}`)
  }

  return (
    <TableRow className="group">
      {/* Client */}
      <TableCell>
        <button
          onClick={goToDetail}
          className="flex items-center gap-3 text-left"
        >
          <UserAvatar name={client.full_name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium hover:underline">
              {client.full_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {client.nationality ?? "—"}
            </p>
          </div>
        </button>
      </TableCell>

      {/* Contact */}
      <TableCell>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            {client.email}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            {client.phone ?? "Not provided"}
          </p>
        </div>
      </TableCell>

      {/* Budget */}
      <TableCell>
        <BudgetRange
          min={client.budget_min}
          max={client.budget_max}
          ceiling={budgetCeiling}
        />
      </TableCell>

      {/* Assigned agent */}
      <TableCell>
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar name={agent?.full_name} src={agent?.avatar} size="xs" />
          <span className="truncate text-sm">
            {agent?.full_name ?? "Unassigned"}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-4 text-right">
        {(onEdit || onStatusChange || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                aria-label="Client actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canEdit && onEdit && (
                <>
                  <DropdownMenuItem
                    onClick={() => onEdit(client)}
                    className="gap-2 text-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {onStatusChange && (
                <>
                  <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Update status
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "active")}
                    className="gap-2 text-sm"
                  >
                    <Circle className="h-3.5 w-3.5 text-success" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "closed-won")}
                    className="gap-2 text-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-info" />
                    Closed — won
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "closed-lost")}
                    className="gap-2 text-sm"
                  >
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    Closed — lost
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "inactive")}
                    className="gap-2 text-sm"
                  >
                    <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    Inactive
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
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete client
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  )
}
