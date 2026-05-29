import Logo from "@/components/layout/Logo"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useLocation, useSearchParams } from "react-router-dom"

const PLACEHOLDERS: Record<string, string> = {
  "/properties": "Search by title, city or neighborhood...",
  "/viewings": "Search by property, client or agent...",
}

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()

  const value = searchParams.get("q") ?? ""
  const placeholder = PLACEHOLDERS[pathname] ?? "Search..."
  const searchable = pathname in PLACEHOLDERS

  // Not searchable → show logo on mobile/tablet, nothing on desktop
  // (desktop already has the sidebar logo).
  if (!searchable) {
    return (
      <div className="lg:hidden">
        <Logo />
      </div>
    )
  }

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams)
    if (next) {
      params.set("q", next)
      params.set("page", "1")
    } else {
      params.delete("q")
    }
    setSearchParams(params)
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 border-border/60 bg-muted/40 pl-9 transition-colors focus-visible:bg-background"
      />
    </div>
  )
}
