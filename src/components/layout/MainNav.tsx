import { useUser } from "@/features/auth/useUser"
import type { NavItem } from "@/lib/constants"
import { workspaceItems } from "@/lib/constants"
import { can } from "@/lib/permissions"
import { Settings } from "lucide-react"
import NavSection from "./NavSection"

const accountItems: NavItem[] = [
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    visible: (role) => can.accessSettings(role), // admin only
  },
]

export default function MainNav({
  collapsed = false,
}: {
  collapsed?: boolean
}) {
  const { user } = useUser()
  const role = user?.user_profile?.role

  // Don't render anything until we know the role
  if (!role) return null

  // Filter items based on the user's role
  const visibleWorkspaceItems = workspaceItems.filter((item) =>
    item.visible(role)
  )
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
