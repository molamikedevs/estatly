import UserAvatar from "@/components/common/UserAvatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUser } from "@/features/auth/useUser"
import type { NavItem } from "@/lib/nav-items"
import { getTabs, isActivePath } from "@/lib/nav-items"
import { cn } from "@/lib/utils"
import { ChevronRight, Ellipsis } from "lucide-react"
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

const PROFILE_PATH = "/profile"

// Shared by the tabs and the More button so they look identical
function tabClass(active: boolean) {
  return cn(
    "flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium select-none",
    "transition-[color,transform] duration-150 ease-out active:scale-95",
    "[-webkit-tap-highlight-color:transparent]",
    active ? "text-primary" : "text-muted-foreground"
  )
}

function rowClass(isActive: boolean) {
  return cn(
    "flex items-center gap-3 rounded-lg px-3 transition-colors active:bg-accent",
    isActive ? "bg-accent text-accent-foreground" : "text-foreground"
  )
}

export default function MobileBottomNav() {
  const { user } = useUser()
  const role = user?.user_profile?.role

  if (!role) return null

  const { tabs, more } = getTabs(role)

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md">
        {tabs.map(({ label, path, icon: Icon }) => (
          <li key={path} className="flex-1">
            <NavLink to={path} className={({ isActive }) => tabClass(isActive)}>
              <Icon className="size-5" />
              <span className="max-w-full truncate px-1">{label}</span>
            </NavLink>
          </li>
        ))}

        {/* Always shown: it is the only way to the profile on a phone */}
        <li className="flex-1">
          <MoreSheet items={more} />
        </li>
      </ul>
    </nav>
  )
}

function MoreSheet({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useUser()
  const profile = user?.user_profile

  const active =
    isActivePath(pathname, PROFILE_PATH) ||
    items.some((item) => isActivePath(pathname, item.path))

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={tabClass(active)}>
          <Ellipsis className="size-5" />
          <span>More</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
          <SheetDescription className="sr-only">
            Your profile and other pages in Estatly
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2 px-2">
          {/* Profile first: photo, theme and sign out all live there */}
          <NavLink
            to={PROFILE_PATH}
            onClick={close}
            className={({ isActive }) => cn(rowClass(isActive), "py-2.5")}
          >
            <UserAvatar
              name={profile?.full_name}
              src={profile?.avatar}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold">
                {profile?.full_name || "Your profile"}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {profile?.role ?? "View profile"}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </NavLink>

          {items.length > 0 && (
            <ul className="flex flex-col gap-1 border-t pt-2">
              {items.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={close}
                    className={({ isActive }) =>
                      cn(rowClass(isActive), "h-12 text-base font-medium")
                    }
                  >
                    <Icon className="size-5 text-muted-foreground" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
