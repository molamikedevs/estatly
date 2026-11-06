import UserAvatar from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TeamMember } from "@/types/database"
import { Mail, Phone } from "lucide-react"
import MemberActions from "./MemberActions"
import Stat from "./Stat"

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
