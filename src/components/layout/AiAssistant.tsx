import { Sparkles } from "lucide-react"

export default function AiAssistant() {
  return (
    <div className="relative mx-3 mb-3 overflow-hidden rounded-xl border border-sidebar-border bg-gradient-to-br from-primary/[0.08] via-sidebar-accent/30 to-transparent p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs leading-tight font-semibold">Just ask me!</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            I here to help you have a smooth ride😄
          </p>
        </div>
      </div>
    </div>
  )
}
