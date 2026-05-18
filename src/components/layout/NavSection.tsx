import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export default function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string
  items: NavItem[]
  collapsed: boolean
}) {
  // Don't render the section if there are no visible items
  if (items.length === 0) return null

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {!collapsed && (
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/70 uppercase">
          {title}
        </p>
      )}
      {items.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              collapsed && "justify-center px-2"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && !collapsed && (
                <span className="absolute top-1/2 -left-3 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge !== undefined && (
                    <span
                      className={cn(
                        "tabular flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
