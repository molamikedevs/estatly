import { useUser } from "@/features/auth/useUser"
import { useProperties } from "@/features/properties/useProperties"
import { useViewings } from "@/features/viewings/useViewings"
import type { NavItem } from "@/lib/constants"
import { workspaceItems } from "@/lib/constants"
import { can } from "@/lib/permissions"
import { Settings, Users } from "lucide-react"
import NavSection from "./NavSection"

const accountItems: NavItem[] = [
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    visible: (role) => can.accessSettings(role), // admin only
  },
  {
    to: "/managers",
    label: "Managers",
    icon: Users,
    visible: (role) => can.accessSettings(role), // admin only
  },
]

export default function MainNav({
  collapsed = false,
}: {
  collapsed?: boolean
}) {
  const { user } = useUser()
  const { properties } = useProperties()
  const { viewings } = useViewings()
  const role = user?.user_profile?.role

  // Don't render anything until we know the role
  if (!role) return null

  // Dynamic counts
  const counts: Record<string, number | undefined> = {
    "/properties": properties?.length,
    "/viewings": viewings?.length,
  }

  // Filter by role, then attach live badge counts
  const visibleWorkspaceItems = workspaceItems
    .filter((item) => item.visible(role))
    .map((item) => ({
      ...item,
      badge: counts[item.to],
    }))

  const visibleAccountItems = accountItems.filter((item) => item.visible(role))

  return (
    <div className="flex flex-col gap-6">
      <NavSection
        title="Workspace"
        items={visibleWorkspaceItems}
        collapsed={collapsed}
      />
      <NavSection
        title="Account"
        items={visibleAccountItems}
        collapsed={collapsed}
      />
    </div>
  )
}
