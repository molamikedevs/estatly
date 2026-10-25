import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Property, PropertyStatus } from "@/types/database"
import {
  BadgeCheck,
  CheckCircle,
  Handshake,
  KeyRound,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { Fragment, type ReactNode } from "react"
import { usePropertyPermissions } from "./usePropertyPermissions"
import { useUpdatePropertyStatus } from "./useUpdatePropertyStatus"

interface StatusAction {
  status: PropertyStatus
  label: string
  icon: LucideIcon
  tone: string
}

/** Only the statuses that make sense for this listing type, minus the current one. */
function getStatusActions(property: Property): StatusAction[] {
  const closing: StatusAction =
    property.listing_type === "rent"
      ? {
          status: "rented",
          label: "Mark rented",
          icon: KeyRound,
          tone: "text-chart-4",
        }
      : {
          status: "sold",
          label: "Mark sold",
          icon: CheckCircle,
          tone: "text-chart-1",
        }

  return [
    {
      status: "under-offer",
      label: "Mark under offer",
      icon: Handshake,
      tone: "text-info",
    },
    closing,
  ].filter((action) => action.status !== property.status) as StatusAction[]
}

interface PropertyActionsMenuProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
  /** "overlay" sits on top of a photo, "outline" sits on the page */
  triggerVariant?: "overlay" | "outline"
  className?: string
}

export default function PropertyActionsMenu({
  property,
  onEdit,
  onDelete,
  triggerVariant = "outline",
  className,
}: PropertyActionsMenuProps) {
  const { canEdit, canPublish, canSetSaleStatus, canDelete } =
    usePropertyPermissions(property)
  const { updateStatus, isPending } = useUpdatePropertyStatus()

  const isAwaitingApproval = property.status === "pending-approval"
  const isClosed = property.status === "sold" || property.status === "rented"

  function setStatus(status: PropertyStatus) {
    updateStatus({ id: property.id, status })
  }

  // Each entry is one group; separators go between groups
  const sections: ReactNode[] = []

  if (canEdit && onEdit) {
    sections.push(
      <DropdownMenuItem onClick={() => onEdit(property)} className="gap-2">
        <Pencil className="h-4 w-4 text-muted-foreground" />
        Edit details
      </DropdownMenuItem>
    )
  }

  if (canPublish && isAwaitingApproval) {
    sections.push(
      <DropdownMenuItem
        onClick={() => setStatus("published")}
        className="gap-2"
      >
        <BadgeCheck className="h-4 w-4 text-success" />
        Approve & publish
      </DropdownMenuItem>
    )
  }

  const statusActions =
    canSetSaleStatus && !isAwaitingApproval && !isClosed
      ? getStatusActions(property)
      : []

  if (statusActions.length > 0) {
    sections.push(
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Listing status
        </DropdownMenuLabel>
        {statusActions.map(({ status, label, icon: Icon, tone }) => (
          <DropdownMenuItem
            key={status}
            onClick={() => setStatus(status)}
            className="gap-2"
          >
            <Icon className={cn("h-4 w-4", tone)} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    )
  }

  if (canPublish && isClosed) {
    sections.push(
      <DropdownMenuItem
        onClick={() => setStatus("published")}
        className="gap-2"
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
        Re-list property
      </DropdownMenuItem>
    )
  }

  if (canDelete && onDelete) {
    sections.push(
      <DropdownMenuItem
        onClick={() => onDelete(property)}
        className="gap-2 text-destructive focus:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        Delete property
      </DropdownMenuItem>
    )
  }

  if (sections.length === 0) return null

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant={triggerVariant === "overlay" ? "secondary" : "outline"}
            disabled={isPending}
            aria-label="Property actions"
            className={cn(
              "h-8 w-8",
              triggerVariant === "overlay" &&
                "bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {sections.map((section, i) => (
            <Fragment key={i}>
              {i > 0 && <DropdownMenuSeparator />}
              {section}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
