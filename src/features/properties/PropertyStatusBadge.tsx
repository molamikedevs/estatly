import { PROPERTY_STATUS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { PropertyStatus } from "@/types/database"

interface PropertyStatusBadgeProps {
  status: PropertyStatus
  /** "overlay" for photos, "inline" for the page */
  variant?: "overlay" | "inline"
  className?: string
}

export default function PropertyStatusBadge({
  status,
  variant = "inline",
  className,
}: PropertyStatusBadgeProps) {
  const config = PROPERTY_STATUS[status] ?? PROPERTY_STATUS.published

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap",
        variant === "overlay"
          ? "bg-background/90 shadow-sm backdrop-blur-sm"
          : "border border-border/60 bg-muted/50",
        config.tone,
        className
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
