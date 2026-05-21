import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/types/index"
import { Mail, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

const roleStyles: Record<string, string> = {
  admin: "bg-accent text-accent-foreground",
  agent: "bg-muted text-muted-foreground",
}

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
        <Avatar className="h-11 w-11 ring-2 ring-card">
          <AvatarImage src={agent.avatar ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
            {getInitials(displayName) || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {agent.specialization || "No specialization"}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 border-0 text-[10px] font-semibold capitalize",
            roleStyles[agent.role] ?? roleStyles.agent
          )}
        >
          {agent.role}
        </Badge>
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
