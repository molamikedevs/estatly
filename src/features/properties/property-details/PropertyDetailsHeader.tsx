import { Badge } from "@/components/ui/badge"
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
import { formatDate } from "@/lib/helpers"
import { can } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import type { Property, PropertyStatus } from "@/types/database"
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  Eye,
  Handshake,
  KeyRound,
  MapPin,
  MoreVertical,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react"

const statusStyles: Record<string, string> = {
  published: "bg-success-muted text-success",
  draft: "bg-warning-muted text-warning",
  archived: "bg-muted text-muted-foreground",
}

interface PropertyDetailsHeaderProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
  onStatusChange?: (property: Property, status: PropertyStatus) => void
}

export default function PropertyDetailsHeader({
  property,
  onEdit,
  onDelete,
  onStatusChange,
}: PropertyDetailsHeaderProps) {
  const { user } = useUser()
  const role = user?.user_profile?.role

  // Permissions flags
  const canPublish = role ? can.publishProperty(role) : false
  const canSetSaleStatus = role ? can.setSaleStatus(role) : false
  const canDelete = role ? can.deleteProperty(role) : false

  // Agent can edit only their own; managers/admins can edit any
  const isOwner = property.agent_id === user?.id
  const canEdit = role
    ? can.editAnyProperty(role) || (role === "agent" && isOwner)
    : false

  function handleStatus(status: PropertyStatus) {
    onStatusChange?.(property, status)
  }
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-accent text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
            For {property.listing_type}
          </Badge>
          <Badge
            className={cn(
              "border-0 text-[10px] font-semibold capitalize",
              statusStyles[property.status] ?? statusStyles.archived
            )}
          >
            {property.status}
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-border/60 text-[10px] font-normal text-muted-foreground capitalize"
          >
            {property.property_type}
          </Badge>
        </div>

        {/* actions menu — appears on hover, bottom right */}
        {(canEdit || canPublish || canSetSaleStatus || canDelete) && (
          <div className="absolute right-3 bottom-3 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shadow-sm backdrop-blur-sm transition-colors data-[state=open]:bg-muted"
                  aria-label="Property actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {/* ── Manage ─────────────────────── */}
                {canEdit && onEdit && (
                  <>
                    <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Manage
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onEdit(property)}
                      className="gap-2 text-sm"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      Edit details
                    </DropdownMenuItem>
                  </>
                )}

                {/* ── Approval ───────────────────── */}
                {canPublish && property.status === "pending-approval" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleStatus("published")}
                      className="gap-2 text-sm"
                    >
                      <BadgeCheck className="h-4 w-4 text-success" />
                      Approve & publish
                    </DropdownMenuItem>
                  </>
                )}

                {/* ── Listing status ─────────────── */}
                {canSetSaleStatus && property.status !== "pending-approval" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Listing status
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatus("under-offer")}
                      className="gap-2 text-sm"
                    >
                      <Handshake className="h-4 w-4 text-warning" />
                      Mark under offer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatus("sold")}
                      className="gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                      Mark sold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatus("rented")}
                      className="gap-2 text-sm"
                    >
                      <KeyRound className="h-4 w-4 text-info" />
                      Mark rented
                    </DropdownMenuItem>
                  </>
                )}

                {/* ── Re-list ────────────────────── */}
                {canPublish &&
                  (property.status === "sold" ||
                    property.status === "rented") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatus("published")}
                        className="gap-2 text-sm"
                      >
                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        Re-list property
                      </DropdownMenuItem>
                    </>
                  )}

                {/* ── Delete ─────────────────────── */}
                {canDelete && onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(property)}
                      className="gap-2 text-sm text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete property
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">
        {property.title}
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0" />
        {property.address}
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {property.views_count} views
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          Listed {formatDate(property.created_at)}
        </span>
      </div>
    </div>
  )
}
