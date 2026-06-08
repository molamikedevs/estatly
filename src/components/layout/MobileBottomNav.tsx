import { useUser } from "@/features/auth/useUser"
import { workspaceItems } from "@/lib/constants"
import { can } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { Settings, Users } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function MobileBottomNav() {
  const { user } = useUser()
  const role = user?.user_profile?.role

  if (!role) return null

  // Workspace items the user can see…
  const workspace = workspaceItems.filter((item) => item.visible(role))

  // …plus Settings if admin, so it isn't stranded
  const items = [
    ...workspace,
    ...(can.accessSettings(role)
      ? [
          {
            to: "/settings",
            label: "Settings",
            icon: Settings,
            visible: () => true,
          },
          {
            to: "/managers",
            label: "Manager",
            icon: Users,
            visible: () => true,
          },
        ]
      : []),
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg lg:hidden"
      aria-label="Primary"
      // iOS safe-area
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive && "scale-110"
                    )}
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
