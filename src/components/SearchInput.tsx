import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [value, setValue] = useState(searchParams.get("search") ?? "")
  const debounced = useDebounce(value, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        const current = params.get("search") ?? ""

        // Same search as the URL already has: keep the current page
        if (debounced === current) return params

        if (debounced) {
          params.set("search", debounced)
        } else {
          params.delete("search")
        }
        params.set("page", "1")

        return params
      },
      { replace: true }
    )
  }, [debounced, setSearchParams])

  return (
    <div className="relative w-full max-w-md">
      <Search className="icon-class" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        enterKeyHint="search"
        className="h-10 bg-muted/50 pl-9"
      />
    </div>
  )
}
