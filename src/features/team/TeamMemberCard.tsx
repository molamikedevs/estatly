import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/UserAvatar"
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

interface TeamMemberCardProps {
  member: TeamMember
  canManage: boolean
  onEdit: () => void
  onToggleActive: () => void
}

export default function TeamMemberCard({
  member,
  canManage,
  onEdit,
  onToggleActive,
}: TeamMemberCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card p-5",
        !member.is_active && "opacity-60"
      )}
    >
      {/* Who */}
      <div className="flex items-start gap-4">
        <UserAvatar name={member.full_name} src={member.avatar} size="lg" />
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate font-medium">{member.full_name}</h3>
          <p className="truncate text-sm text-muted-foreground">
            {member.specialization || "No specialization"}
          </p>
        </div>
        {canManage && (
          <MemberActions
            member={member}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        )}
      </div>

      {/* Workload: number on top, label below */}
      <dl className="mt-5 grid grid-cols-3 divide-x rounded-lg bg-muted/60 py-3 text-center">
        <Stat label="Listings" value={member.listing_count} />
        <Stat label="Clients" value={member.active_client_count} />
        <Stat label="Viewings" value={member.upcoming_viewing_count} />
      </dl>

      {/* Contact */}
      <div className="mt-4 flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={`mailto:${member.email}`} title={member.email}>
            <Mail />
            Email
          </a>
        </Button>
        {member.phone && (
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a
              href={`tel:${member.phone.replace(/\s/g, "")}`}
              title={member.phone}
            >
              <Phone />
              Call
            </a>
          </Button>
        )}
      </div>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    // flex-col-reverse: dt comes first in the HTML, but the number shows on top
    <div className="flex flex-col-reverse px-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-xl font-semibold tabular-nums",
          value === 0 && "text-muted-foreground"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function MemberActions({
  member,
  onEdit,
  onToggleActive,
}: Omit<TeamMemberCardProps, "canManage">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-mt-1 -mr-2 size-9 shrink-0 text-muted-foreground"
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
