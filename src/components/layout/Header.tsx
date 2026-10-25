import SearchInput from "@/components/common/SearchInput"
import ThemeSwitch from "@/components/theme/ThemeSwitch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SEARCH_PLACEHOLDERS } from "@/lib/constants"
import { getPageTitle } from "@/lib/nav-items"
import { useLocation } from "react-router-dom"
import ProfileLink from "./ProfileLink"

export default function Header() {
  const { pathname } = useLocation()

  const searchable = pathname in SEARCH_PLACEHOLDERS
  const title = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 items-center gap-2 border-b bg-background/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur sm:px-6">
      {/* Desktop and tablet: collapse the sidebar */}
      <SidebarTrigger className="-ml-1 hidden md:flex" />

      {/* Phone: the page h1 scrolls away, so the sticky header names the section */}
      {!searchable && (
        <p className="truncate text-base font-semibold md:hidden">{title}</p>
      )}

      {/* key = pathname gives each page a fresh search box */}
      {searchable && (
        <SearchInput
          key={pathname}
          placeholder={SEARCH_PLACEHOLDERS[pathname]}
        />
      )}

      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitch />
        <div className="md:hidden">
          <ProfileLink />
        </div>
      </div>
    </header>
  )
}
