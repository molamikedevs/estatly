import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  subtitle?: string
  tone?: "primary" | "info" | "warning" | "success"
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info-muted text-info",
  warning: "bg-warning-muted text-warning",
  success: "bg-success-muted text-success",
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone = "primary",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            toneStyles[tone]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="tabular mt-3 text-2xl font-semibold tracking-tight">
        {value}
      </div>
      {subtitle && (
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
