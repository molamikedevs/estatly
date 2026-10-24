import UserAvatar from "@/components/UserAvatar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useUser } from "@/features/auth/useUser"
import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function ProfileLink({
  inSidebar = false,
}: {
  inSidebar?: boolean
}) {
  const { user } = useUser()
  const { pathname } = useLocation()

  if (!user) return null

  const name = user.user_profile?.full_name || user.email || "User"
  const role = user.user_profile?.role
  const to = `/profile/${user.id}`

  const avatar = (
    <UserAvatar name={name} src={user.user_profile?.avatar} size="sm" />
  )

  // Phone header: just the avatar
  if (!inSidebar) {
    return (
      <Link
        to={to}
        aria-label="Your profile"
        className="flex rounded-full transition-transform duration-150 active:scale-95"
      >
        {avatar}
      </Link>
    )
  }

  // Sidebar footer: avatar, name and role
  return (
    <SidebarMenuButton
      asChild
      size="lg"
      isActive={pathname.startsWith("/profile")}
      tooltip={name}
      className="h-12 gap-3"
    >
      <Link to={to}>
        {avatar}
        <span className="grid flex-1 text-left leading-tight">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="truncate text-xs text-sidebar-foreground/60 capitalize">
            {role}
          </span>
        </span>
        <ChevronRight className="ml-auto size-4 text-sidebar-foreground/40" />
      </Link>
    </SidebarMenuButton>
  )
}
