import { can } from "@/lib/permissions"
import type { UserRole } from "@/types"
import { Building2, Calendar, LayoutDashboard, User, Users } from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  visible: (role: UserRole) => boolean
}

export const workspaceItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    visible: () => true,
  },
  {
    to: "/properties",
    label: "Properties",
    icon: Building2,
    visible: () => true,
  },
  {
    to: "/agents",
    label: "Agents",
    icon: Users,
    visible: (role) => can.accessAgentsPage(role),
  },
  {
    to: "/clients",
    label: "Clients",
    icon: User,
    visible: () => true,
  },
  {
    to: "/viewings",
    label: "Viewings",
    icon: Calendar,
    visible: () => true,
  },
]
export const PAGE_SIZE = 8
