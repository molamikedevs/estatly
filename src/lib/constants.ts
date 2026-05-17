// TODO: Constants (PROPERTY_TYPES, CITIES, STATUSES, etc.)

import {
  Building2,
  CalendarCheck,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react"

export const workspaceItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/properties", label: "Properties", icon: Building2, badge: 12 },
  { to: "/agents", label: "Agents", icon: Users },
  { to: "/clients", label: "Clients", icon: UserRound },
  { to: "/viewings", label: "Viewings", icon: CalendarCheck, badge: 3 },
]
