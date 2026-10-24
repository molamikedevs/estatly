import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface StateMessageProps {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
  compact?: boolean
}

export default function StateMessage({
  icon,
  title,
  message,
  action,
  compact,
}: StateMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        // compact: inside a panel, no box. Otherwise a dashed box on the page.
        compact ? "py-8" : "rounded-xl border border-dashed py-16"
      )}
    >
      <span className="text-muted-foreground [&>svg]:size-6">{icon}</span>
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
