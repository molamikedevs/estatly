import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router-dom"
import { Button } from "../ui/button"

interface FilterOption {
  value: string
  label: string
}

interface FilterProps {
  filterField: string
  options: FilterOption[]
}

export default function Filter({ filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentFilter = searchParams.get(filterField) || options[0].value

  function handleClick(value: string) {
    if (value === currentFilter) return
    const next = new URLSearchParams(searchParams)
    next.set(filterField, value)
    if (next.get("page")) next.set("page", "1")
    setSearchParams(next)
  }

  return (
    <div
      role="group"
      className="inline-flex items-center gap-1 rounded-lg border bg-card p-1 shadow-sm"
    >
      {options.map((option) => {
        const isActive = option.value === currentFilter
        return (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            aria-pressed={isActive}
            onClick={() => handleClick(option.value)}
            className={cn(
              "h-8 px-3 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
