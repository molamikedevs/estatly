import ThemeSwitch from "@/components/theme/ThemeSwitch"
import { getPageTitle } from "@/lib/nav-items"
import { useLocation } from "react-router-dom"

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 items-center gap-2 border-b bg-background/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur sm:px-6 md:hidden">
      {/* The page h1 scrolls away, so the sticky bar names the section */}
      <p className="truncate text-base font-semibold">
        {getPageTitle(pathname)}
      </p>
      <div className="ml-auto">
        <ThemeSwitch />
      </div>
    </header>
  )
}
