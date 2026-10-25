import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface DisplayFieldProps {
  icon: LucideIcon
  label: string
  value: string | null | undefined
  mono?: boolean
}

export default function DisplayField({
  icon: Icon,
  label,
  value,
  mono = false,
}: DisplayFieldProps) {
  const empty = !value

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3.5 transition-colors hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 truncate text-sm",
            empty
              ? "text-muted-foreground/60 italic"
              : "font-medium text-foreground",
            mono && !empty && "font-mono text-xs"
          )}
          title={value ?? undefined}
        >
          {value || "Not provided"}
        </p>
      </div>
    </div>
  )
}
