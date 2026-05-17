import { cn } from "@/lib/utils"

export default function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn("flex items-center gap-3", collapsed && "justify-center")}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/75 shadow-sm ring-1 ring-primary/20">
        <img src="/estatly.png" alt="Estatly" className="h-6 w-6" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-[15px] leading-none font-semibold tracking-tight">
            Estatly
          </span>
          <span className="mt-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Property Suite
          </span>
        </div>
      )}
    </div>
  )
}
