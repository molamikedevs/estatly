import UserAvatar from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { TeamMember } from "@/types/database"
import {
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  UserCheck,
  UserX,
} from "lucide-react"

// Shared by the column labels and every row, so they line up
export const TEAM_GRID =
  "md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)_5.5rem_5.5rem_5.5rem_2.5rem]"

interface TeamMemberRowProps {
  member: TeamMember
  canManage: boolean
  onEdit: () => void
  onToggleActive: () => void
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

export default function TeamMemberRow({
  member,
  canManage,
  onEdit,
  onToggleActive,
}: TeamMemberRowProps) {
  const identity = (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={member.full_name} src={member.avatar} size="sm" />
      <div className="min-w-0">
        <p className="truncate font-medium">{member.full_name}</p>
        {member.specialization && (
          <p className="truncate text-sm text-muted-foreground">
            {member.specialization}
          </p>
        )}
      </div>
    </div>
  )

  const contact = (
    <div className="flex min-w-0 flex-col text-sm">
      <a
        href={`mailto:${member.email}`}
        className="flex min-h-8 items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Mail className="size-4 shrink-0" />
        <span className="truncate">{member.email}</span>
      </a>
      {member.phone && (
        <a
          href={`tel:${member.phone.replace(/\s/g, "")}`}
          className="flex min-h-8 items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Phone className="size-4 shrink-0" />
          <span className="truncate tabular-nums">{member.phone}</span>
        </a>
      )}
    </div>
  )

  const actions = canManage ? (
    <MemberActions
      member={member}
      onEdit={onEdit}
      onToggleActive={onToggleActive}
    />
  ) : (
    <span />
  )

  return (
    <li className={cn(!member.is_active && "opacity-60")}>
      {/* Desktop: one row in the grid */}
      <div
        className={cn("hidden items-center gap-4 px-4 py-3 md:grid", TEAM_GRID)}
      >
        {identity}
        {contact}
        <Figure label="Listings" value={member.listing_count} />
        <Figure label="Active clients" value={member.active_client_count} />
        <Figure
          label="Upcoming viewings"
          value={member.upcoming_viewing_count}
        />
        {actions}
      </div>

      {/* Phone: a card */}
      <div className="space-y-2 p-4 md:hidden">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">{identity}</div>
          {actions}
        </div>
        {contact}
        <p className="text-sm text-muted-foreground tabular-nums">
          {plural(member.listing_count, "listing")} ·{" "}
          {plural(member.active_client_count, "active client")} ·{" "}
          {plural(member.upcoming_viewing_count, "viewing")}
        </p>
      </div>
    </li>
  )
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <p
      className={cn(
        "text-center text-sm font-medium tabular-nums",
        value === 0 && "text-muted-foreground"
      )}
    >
      <span className="sr-only">{label}: </span>
      {value}
    </p>
  )
}

function MemberActions({
  member,
  onEdit,
  onToggleActive,
}: Omit<TeamMemberRowProps, "canManage">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 text-muted-foreground"
          aria-label={`Actions for ${member.full_name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil />
          Edit details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {member.is_active ? (
          <DropdownMenuItem variant="destructive" onSelect={onToggleActive}>
            <UserX />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={onToggleActive}>
            <UserCheck />
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
