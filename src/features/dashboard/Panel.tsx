import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PanelProps {
  title: string
  count?: number
  action?: ReactNode
  className?: string
  children: ReactNode
}

export default function Panel({
  title,
  count,
  action,
  className,
  children,
}: PanelProps) {
  return (
    <section
      className={cn("min-w-0 rounded-xl border bg-card p-4 sm:p-5", className)}
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 truncate text-base font-semibold">
          {title}
          {count !== undefined && (
            <span className="ml-2 font-normal text-muted-foreground tabular-nums">
              {count}
            </span>
          )}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
