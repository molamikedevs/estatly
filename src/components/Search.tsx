import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchInput() {
  return (
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
  )
}
