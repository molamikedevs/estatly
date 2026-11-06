import { cn } from "@/lib/utils"

export default function Stat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    // flex-col-reverse: dt comes first in the HTML, but the number shows on top
    <div className="flex flex-col-reverse px-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-xl font-semibold tabular-nums",
          value === 0 && "text-muted-foreground"
        )}
      >
        {value}
      </dd>
    </div>
  )
}
