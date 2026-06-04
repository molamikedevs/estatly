import RoleBadge from "@/components/RoleBadge"
import UserAvatar from "@/components/UserAvatar"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/types/database"
import { Mail, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ManagerCard({ manager }: { manager: UserProfile }) {
  const navigate = useNavigate()
  const displayName = manager.full_name || manager.email || "Unnamed manager"

  return (
    <button
      onClick={() => navigate(`/managers/${manager.user_id}`)}
      className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-card"
    >
      {/* ── Accent banner ─────────────────────── */}
      <div className="relative h-16 bg-gradient-to-br from-primary via-primary/85 to-primary/65">
        <div className="spotlight absolute inset-0 opacity-50" />
        <div className="absolute top-3 right-3">
          <RoleBadge
            role={manager.role}
            className="bg-card/25 text-white backdrop-blur-sm"
          />
        </div>
      </div>

      {/* ── Identity ──────────────────────────── */}
      <div className="-mt-7 flex flex-col items-start px-5">
        <UserAvatar
          name={displayName}
          src={manager.avatar}
          size="lg"
          ring
          className="shadow-elevated ring-4"
        />
        <div className="mt-3 w-full min-w-0">
          <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {manager.specialization || "No specialization"}
          </p>
        </div>
      </div>

      {/* ── Contact ───────────────────────────── */}
      <div className="mt-4 flex flex-col gap-1.5 border-t border-border/60 px-5 py-3.5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{manager.email}</span>
        </span>
        <span
          className={cn(
            "flex items-center gap-2 text-xs",
            manager.phone
              ? "text-muted-foreground"
              : "text-muted-foreground/60 italic"
          )}
        >
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {manager.phone || "Not provided"}
        </span>
      </div>
    </button>
  )
}
