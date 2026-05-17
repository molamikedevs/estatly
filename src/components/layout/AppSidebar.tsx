import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import AiAssistant from "./AiAssistant"
import Logo from "./Logo"
import MainNav from "./MainNav"

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* subtle spotlight glow at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.06] to-transparent" />

      <div className="relative flex h-16 items-center border-b border-sidebar-border px-4">
        <Logo collapsed={collapsed} />
      </div>

      <div className="relative flex-1 scrollbar-thin overflow-y-auto py-5">
        <MainNav collapsed={collapsed} />
      </div>

      {!collapsed && <AiAssistant />}

      <div className="relative border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
