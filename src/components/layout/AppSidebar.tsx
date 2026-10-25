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
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@/features/auth/useUser"
import { getNavItems, isActivePath, NAV_GROUPS } from "@/lib/nav-items"
import { useEffect, useRef, type FocusEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import Logo from "./Logo"
import ProfileLink from "./ProfileLink"

export const collapsedButton =
  "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"

export const hideWhenCollapsed = "group-data-[collapsible=icon]:hidden"
const OPEN_DELAY_MS = 120

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
  const { setOpen, isMobile } = useSidebar()
  const openTimer = useRef<number | undefined>(undefined)

  const role = user?.user_profile?.role
  const items = role ? getNavItems(role) : []

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  function open() {
    if (isMobile) return
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
  }

  function close() {
    window.clearTimeout(openTimer.current)
    setOpen(false)
  }

  // Keyboard users: open when focus enters, close when it leaves the sidebar
  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close()
  }

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={handleBlur}
      className="z-40 transition-shadow duration-200 group-data-[state=expanded]:shadow-2xl"
    >
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-3 group-data-[collapsible=icon]:items-center">
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
                        {/* Choosing a page closes the sidebar */}
                        <Link to={path} onClick={close}>
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
          <SidebarMenuItem onClick={close}>
            <ProfileLink inSidebar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
