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

// Next steps for a live listing: published ⇄ under offer → sold or rented
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

  // An offer can fall through: the listing goes back on the market
  if (property.status === "under-offer") {
    return [
      {
        status: "published",
        label: "Offer fell through",
        icon: RotateCcw,
        tone: "text-muted-foreground",
      },
      closing,
    ]
  }

  return [
    {
      status: "under-offer",
      label: "Mark under offer",
      icon: Handshake,
      tone: "text-info",
    },
    closing,
  ]
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
      <DropdownMenuItem onSelect={() => onEdit(property)}>
        <Pencil className="text-muted-foreground" />
        Edit details
      </DropdownMenuItem>
    )
  }

  if (canPublish && isAwaitingApproval) {
    sections.push(
      <DropdownMenuItem onSelect={() => setStatus("published")}>
        <BadgeCheck className="text-success" />
        Approve & publish
      </DropdownMenuItem>
    )
  }

  // Live listings only: pending ones need approval, closed ones re-listing
  if (canSetSaleStatus && !isAwaitingApproval && !isClosed) {
    sections.push(
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Listing status
        </DropdownMenuLabel>
        {getStatusActions(property).map(
          ({ status, label, icon: Icon, tone }) => (
            <DropdownMenuItem key={status} onSelect={() => setStatus(status)}>
              <Icon className={tone} />
              {label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuGroup>
    )
  }

  if (canPublish && isClosed) {
    sections.push(
      <DropdownMenuItem onSelect={() => setStatus("published")}>
        <RotateCcw className="text-muted-foreground" />
        Re-list property
      </DropdownMenuItem>
    )
  }

  if (canDelete && onDelete) {
    sections.push(
      <DropdownMenuItem
        variant="destructive"
        onSelect={() => onDelete(property)}
      >
        <Trash2 />
        Delete property
      </DropdownMenuItem>
    )
  }

  // Nothing this user can do: no empty menu
  if (sections.length === 0) return null

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant={triggerVariant === "overlay" ? "secondary" : "outline"}
            disabled={isPending}
            aria-label={`Actions for ${property.title}`}
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
