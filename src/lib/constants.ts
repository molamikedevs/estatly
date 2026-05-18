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
    visible: () => true, // All roles
  },
  {
    to: "/properties",
    label: "Properties",
    icon: Building2,
    badge: 12,
    visible: () => true, // All roles
  },
  {
    to: "/agents",
    label: "Agents",
    icon: Users,
    visible: (role) => can.accessAgentsPage(role), // admin + manager only
  },
  {
    to: "/clients",
    label: "Clients",
    icon: User,
    visible: () => true, // All roles
  },
  {
    to: "/viewings",
    label: "Viewings",
    icon: Calendar,
    badge: 3,
    visible: () => true, // All roles
  },
]
