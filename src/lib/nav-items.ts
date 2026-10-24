import type { UserRole } from "@/types/database"
import type { LucideIcon } from "lucide-react"
import {
  Building2,
  CalendarDays,
  Contact,
  LayoutDashboard,
  Settings,
  UserCog,
  Users,
} from "lucide-react"

export type NavGroup = "Workspace" | "Team" | "Admin"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  roles: UserRole[]
  group: NavGroup
}

// The order here is the order on screen, in the sidebar and the bottom bar.
// Roles must match the RoleProtected lists in App.tsx.
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "agent"],
    group: "Workspace",
  },
  {
    label: "Properties",
    path: "/properties",
    icon: Building2,
    roles: ["admin", "manager", "agent"],
    group: "Workspace",
  },
  {
    label: "Viewings",
    path: "/viewings",
    icon: CalendarDays,
    roles: ["admin", "manager", "agent"],
    group: "Workspace",
  },
  {
    label: "Clients",
    path: "/clients",
    icon: Contact,
    roles: ["admin", "manager", "agent"],
    group: "Workspace",
  },
  {
    label: "Agents",
    path: "/agents",
    icon: Users,
    roles: ["admin", "manager"],
    group: "Team",
  },
  {
    label: "Managers",
    path: "/managers",
    icon: UserCog,
    roles: ["admin"],
    group: "Team",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin"],
    group: "Admin",
  },
]

export const NAV_GROUPS: NavGroup[] = ["Workspace", "Team", "Admin"]

const MAX_TABS = 5

export function getNavItems(role: UserRole) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role))
}

// 5 items or fewer: all are tabs. More than 5: first 4 are tabs, the rest go in "More".
export function getTabs(role: UserRole) {
  const items = getNavItems(role)

  if (items.length <= MAX_TABS) {
    return { tabs: items, more: [] }
  }

  return { tabs: items.slice(0, 4), more: items.slice(4) }
}

// "/properties/42" counts as being inside "/properties"
export function isActivePath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function getPageTitle(pathname: string) {
  if (pathname.startsWith("/profile")) return "Profile"

  const item = NAV_ITEMS.find((navItem) => isActivePath(pathname, navItem.path))
  return item ? item.label : "Estatly"
}
