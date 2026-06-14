import RoleBadge from "@/components/RoleBadge"
import UserAvatar from "@/components/UserAvatar"
import { cn } from "@/lib/utils"
import type { CreatableRole, UserProfile } from "@/types/database"
import { Mail, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TeamMemberCardProps {
  member: UserProfile
  role: CreatableRole
}

/** The contact rows are identical across both layouts. */
function ContactDetails({ member }: { member: UserProfile }) {
  return (
    <>
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <Mail className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{member.email}</span>
      </span>
      <span
        className={cn(
          "flex items-center gap-2 text-xs",
          member.phone
            ? "text-muted-foreground"
            : "text-muted-foreground/60 italic"
        )}
      >
        <Phone className="h-3.5 w-3.5 shrink-0" />
        {member.phone || "Not provided"}
      </span>
    </>
  )
}

export default function TeamMemberCard({ member, role }: TeamMemberCardProps) {
  const navigate = useNavigate()
  const displayName = member.full_name || member.email || `Unnamed ${role}`
  const to = `/${role}s/${member.user_id}`

  // ── Manager layout: gradient banner + overlaid avatar ──
  if (role === "manager") {
    return (
      <button
        onClick={() => navigate(to)}
        className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-card"
      >
        <div className="relative h-16 bg-gradient-to-br from-primary via-primary/85 to-primary/65">
          <div className="spotlight absolute inset-0 opacity-50" />
          <div className="absolute top-3 right-3">
            <RoleBadge
              role={member.role}
              className="bg-card/25 text-white backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="-mt-7 flex flex-col items-start px-5">
          <UserAvatar
            name={displayName}
            src={member.avatar}
            size="lg"
            ring
            className="shadow-elevated ring-4"
          />
          <div className="mt-3 w-full min-w-0">
            <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {member.specialization || "No specialization"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-border/60 px-5 py-3.5">
          <ContactDetails member={member} />
        </div>
      </button>
    )
  }

  // ── Agent layout: flat row ──
  return (
    <button
      onClick={() => navigate(to)}
      className="card-hover group flex flex-col rounded-xl border bg-card p-4 text-left shadow-card"
    >
      <div className="flex items-center gap-3">
        <UserAvatar name={displayName} src={member.avatar} size="md" ring />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {member.specialization || "No specialization"}
          </p>
        </div>
        <RoleBadge role={member.role} />
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5 border-t border-border/60 pt-3">
        <ContactDetails member={member} />
      </div>
    </button>
  )
}
