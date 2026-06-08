import ThemeSwitch from "@/components/theme/ThemeSwitch"
import Logout from "@/features/auth/Logout"
import UserProfileAvatar from "@/features/team/UserProfileAvatar"
import SearchInput from "../SearchInput"

export default function Header() {
  return (
    <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/60 px-6">
      <SearchInput />

      <div className="ml-auto flex items-center gap-1.5">
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <UserProfileAvatar />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <ThemeSwitch />
        <Logout />
      </div>
    </header>
  )
}
