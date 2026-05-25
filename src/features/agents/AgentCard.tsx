import RoleBadge from "@/components/RoleBadge"
import UserAvatar from "@/components/UserAvatar"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/types/database"
import { Mail, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AgentCard({ agent }: { agent: UserProfile }) {
  const navigate = useNavigate()
  const displayName = agent.full_name || agent.email || "Unnamed agent"

  return (
    <button
      onClick={() => navigate(`/agents/${agent.user_id}`)}
      className="card-hover group flex flex-col rounded-xl border bg-card p-4 text-left shadow-card"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserAvatar name={displayName} src={agent.avatar} size="md" ring />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {agent.specialization || "No specialization"}
          </p>
        </div>
        <RoleBadge role={agent.role} />
      </div>

      {/* Contact details */}
      <div className="mt-3.5 flex flex-col gap-1.5 border-t border-border/60 pt-3">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{agent.email}</span>
        </span>
        <span
          className={cn(
            "flex items-center gap-2 text-xs",
            agent.phone
              ? "text-muted-foreground"
              : "text-muted-foreground/60 italic"
          )}
        >
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {agent.phone || "Not provided"}
        </span>
      </div>
    </button>
  )
}
