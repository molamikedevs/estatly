import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/database"

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-accent text-accent-foreground" },
  agent: { label: "Agent", className: "bg-muted text-muted-foreground" },
  manager: { label: "Manager", className: "bg-info-muted text-info" },
}

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export default function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role] ?? roleConfig.agent

  return (
    <Badge
      variant="secondary"
      className={cn(
        "shrink-0 border-0 text-[10px] font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
