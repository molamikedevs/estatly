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
import { formatPrice, formatSize } from "@/lib/helpers"
import { can } from "@/lib/permissions"
import type { Property, PropertyStatus } from "@/types/database"
import {
  BadgeCheck,
  Bath,
  BedDouble,
  CheckCircle,
  Handshake,
  ImageOff,
  KeyRound,
  MapPin,
  MoreVertical,
  Pencil,
  RotateCcw,
  Ruler,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyStatusBadge from "./PropertyStatusBadge"

interface PropertyCardProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
  onStatusChange?: (property: Property, status: PropertyStatus) => void
}

export default function PropertyCard({
  property,
  onEdit,
  onDelete,
  onStatusChange,
}: PropertyCardProps) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const { user } = useUser()
  const role = user?.user_profile?.role

  const isRent = property.listing_type === "rent"

  // Permissions flags
  const canPublish = role ? can.publishProperty(role) : false
  const canSetSaleStatus = role ? can.setSaleStatus(role) : false
  const canDelete = role ? can.deleteProperty(role) : false

  // Agent can edit only their own; managers/admins can edit any
  const isOwner = property.agent_id === user?.id
  const canEdit = role
    ? can.editAnyProperty(role) || (role === "agent" && isOwner)
    : false

  function goToDetail() {
    navigate(`/properties/${property.id}`)
  }

  function handleStatus(status: PropertyStatus) {
    onStatusChange?.(property, status)
  }

  return (
    <div className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-card">
      {/* ── Image ──────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* clickable image → detail */}
        <button
          onClick={goToDetail}
          className="block h-full w-full"
          aria-label={`View ${property.title}`}
        >
          {property.main_image && !imgError ? (
            <img
              src={property.main_image}
              alt={property.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
        </button>

        {/* listing type — top left */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase backdrop-blur-sm">
          For {property.listing_type}
        </span>

        {/* status — top right */}
        {/* <Badge
          className={cn(
            "pointer-events-none absolute top-3 right-3 border-0 text-[10px] font-semibold capitalize backdrop-blur-sm",
            statusStyles[property.status] ?? statusStyles.archived
          )}
        >
          {property.status}
        </Badge> */}
        <PropertyStatusBadge status={property.status} />

        {/* actions menu — appears on hover, bottom right */}
        {(canEdit || canPublish || canSetSaleStatus || canDelete) && (
          <div className="absolute right-3 bottom-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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

      {/* ── Body — clickable → detail ──────────── */}
      <button
        onClick={goToDetail}
        className="flex flex-1 flex-col p-4 text-left"
      >
        <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </p>

        <p className="tabular mt-2.5 text-lg font-bold text-primary">
          {formatPrice(property.price, property.listing_type).replace(
            "/yr",
            ""
          )}
          {isRent && (
            <span className="text-xs font-normal text-muted-foreground">
              /yr
            </span>
          )}
        </p>

        {/* specs */}
        <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            <span className="tabular">{property.bedrooms}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            <span className="tabular">{property.bathrooms}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />
            <span className="tabular">{formatSize(property.size_sqm)}</span>
          </span>
        </div>
      </button>
    </div>
  )
}
