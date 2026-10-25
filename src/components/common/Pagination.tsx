import { PAGE_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { Button } from "../ui/button"

interface PaginationProps {
  count: number
  label?: string
}

type PageItem = number | "start-gap" | "end-gap"

/** 1 … 4 5 6 … 20 once there are more than 7 pages. */
function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  const items: PageItem[] = [1]

  if (start > 2) items.push("start-gap")
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push("end-gap")
  items.push(total)

  return items
}

export default function Pagination({
  count,
  label = "items",
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageCount = Math.ceil(count / PAGE_SIZE)
  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    Math.max(pageCount, 1)
  )

  if (pageCount <= 1) return null

  function goToPage(page: number) {
    if (page < 1 || page > pageCount || page === currentPage) return
    const next = new URLSearchParams(searchParams)
    next.set("page", String(page))
    setSearchParams(next)
  }

  const from = (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, count)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-4 sm:flex-row"
    >
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="tabular font-medium text-foreground">{from}</span>–
        <span className="tabular font-medium text-foreground">{to}</span> of{" "}
        <span className="tabular font-medium text-foreground">{count}</span>{" "}
        {label}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 gap-1 px-2.5"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Full page list from sm up, compact counter on phones */}
        <div className="hidden items-center gap-1 sm:flex">
          {getPageItems(currentPage, pageCount).map((item) =>
            typeof item === "number" ? (
              <Button
                key={item}
                variant="ghost"
                size="sm"
                onClick={() => goToPage(item)}
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  "tabular h-8 min-w-8 px-2 text-xs",
                  item === currentPage
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item}
              </Button>
            ) : (
              <span
                key={item}
                aria-hidden
                className="flex h-8 w-6 items-end justify-center pb-1.5 text-xs text-muted-foreground"
              >
                …
              </span>
            )
          )}
        </div>

        <span className="tabular px-2 text-xs text-muted-foreground sm:hidden">
          <span className="font-medium text-foreground">{currentPage}</span> /{" "}
          {pageCount}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="h-8 gap-1 px-2.5"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}
