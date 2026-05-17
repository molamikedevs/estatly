import ThemeSwitch from "@/components/theme/ThemeSwitch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Search } from "lucide-react"

export default function Header() {
  return (
    <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/60 px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search properties, clients, agents..."
          className="h-10 border-border/60 bg-muted/40 pr-16 pl-9 transition-colors focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Property</span>
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <ThemeSwitch />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </span>
        </Button>

        <button
          className="relative ml-1 transition-opacity hover:opacity-90"
          aria-label="Account"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
        </button>
      </div>
    </header>
  )
}
