import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { LogoMark } from "../common/LogoMark"

// Tile + name, linking to the dashboard: sidebar, login
export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/dashboard"
      aria-label="Estatly home"
      className={cn(
        "flex items-center gap-2.5 rounded-lg",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className
      )}
    >
      <LogoMark />
      {/* Hidden when the sidebar is collapsed to icons */}
      <span className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
        Estatly
      </span>
    </Link>
  )
}
