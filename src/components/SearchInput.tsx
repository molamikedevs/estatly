import Logo from "@/components/layout/Logo"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"

const PLACEHOLDERS: Record<string, string> = {
  "/properties": "Search by property title or city...",
  "/viewings": "Search by property title or city...",
}

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()

  const [value, setValue] = useState(searchParams.get("q") ?? "")
  const debounce = useDebounce(value, SEARCH_DEBOUNCE_MS)

  const placeholder = PLACEHOLDERS[pathname] ?? "Search..."
  const searchable = pathname in PLACEHOLDERS

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)

        if (debounce) {
          params.set("q", debounce)
          params.set("page", "1")
        } else {
          params.delete("q")
        }

        return params
      },
      { replace: true }
    )
  }, [debounce, setSearchParams])

  // Not searchable → show logo on mobile/tablet, nothing on desktop
  if (!searchable) {
    return (
      <div className="lg:hidden">
        <Logo />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-10 border-border/60 bg-muted/40 pl-9 transition-colors focus-visible:bg-background"
      />
    </div>
  )
}
