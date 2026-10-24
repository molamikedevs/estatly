import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

// The tile on its own: loader, error screen, anywhere without a link
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="64" height="64" rx="16" fill="var(--primary)" />
      <g
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M44 19 H20 V45 H44" />
        <path d="M20 32 H38" />
      </g>
    </svg>
  )
}

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
