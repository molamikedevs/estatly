import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/features/auth/useUser"
import { getNavItems, isActivePath, NAV_GROUPS } from "@/lib/nav-items"
import { Link, useLocation } from "react-router-dom"
import Logo from "./Logo"
import ProfileLink from "./ProfileLink"

export const collapsedButton =
  "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"

// Hides text when the sidebar is collapsed
export const hideWhenCollapsed = "group-data-[collapsible=icon]:hidden"

// shadcn sets data-active="true" on the current item, so we style from that
const itemClass = [
  "h-10 gap-3 px-3 text-[15px]",
  "text-sidebar-foreground/75 hover:text-sidebar-foreground",
  "[&>svg]:size-[18px] [&>svg]:text-sidebar-foreground/60",
  "group-data-[collapsible=icon]:[&>svg]:size-5",
  "data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground",
  "data-[active=true]:[&>svg]:text-sidebar-primary",
  collapsedButton,
].join(" ")

export default function AppSidebar() {
  const { user } = useUser()
  const { pathname } = useLocation()

  const role = user?.user_profile?.role
  const items = role ? getNavItems(role) : []

  return (
    <Sidebar collapsible="icon">
      {/* Same height as the page header, so both borders line up */}
      <SidebarHeader className="h-[calc(3.5rem+env(safe-area-inset-top))] justify-center border-b border-sidebar-border px-3 pt-[env(safe-area-inset-top)] group-data-[collapsible=icon]:items-center">
        <Logo className="px-1 group-data-[collapsible=icon]:px-0" />
      </SidebarHeader>

      <SidebarContent className="gap-2 py-3">
        {NAV_GROUPS.map((group) => {
          const groupItems = items.filter((item) => item.group === group)

          // An agent has no Team or Admin items, so those groups disappear
          if (groupItems.length === 0) return null

          return (
            <SidebarGroup key={group} className="px-3">
              <SidebarGroupLabel className="px-3 text-xs font-medium text-sidebar-foreground/50">
                {group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {groupItems.map(({ label, path, icon: Icon }) => (
                    <SidebarMenuItem key={path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActivePath(pathname, path)}
                        tooltip={label}
                        className={itemClass}
                      >
                        <Link to={path}>
                          <Icon />
                          <span className={hideWhenCollapsed}>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileLink inSidebar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
