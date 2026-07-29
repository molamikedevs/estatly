import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { Button } from "./ui/button"

interface PaginationProps {
  count: number
  label?: string
  pageSizes?: number[]
}

export default function Pagination({
  count,
  label = "items",
  pageSizes = [10, 20, 50],
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? "1")
  const size = Number(searchParams.get("page_size") ?? "10")

  const pageSize = Number.isNaN(size) || size < 1 ? 10 : size
  const pageCount = Math.ceil(count / pageSize)

  const currentPage =
    Number.isNaN(page) || page < 1 ? 1 : Math.min(page, pageCount)

  function updateParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      next.set(key, value)
    })

    setSearchParams(next)
  }

  function goToPage(page: number) {
    updateParams({ page: String(page) })
  }

  function changePageSize(size: number) {
    updateParams({
      page_size: String(size),
      page: "1",
    })
  }

  function nextPage() {
    if (currentPage < pageCount) goToPage(currentPage + 1)
  }

  function prevPage() {
    if (currentPage > 1) goToPage(currentPage - 1)
  }

  if (count === 0) return null

  const from = (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, count)

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="tabular font-medium text-foreground">{from}</span>–
          <span className="tabular font-medium text-foreground">{to}</span> of{" "}
          <span className="tabular font-medium text-foreground">{count}</span>{" "}
          {label}
        </p>

        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="h-8 rounded-md border bg-background px-2 text-xs"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="h-8 gap-1 px-2.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => goToPage(page)}
              disabled={page === currentPage}
              className={cn(
                "tabular h-8 w-8 p-0 text-xs disabled:opacity-100",
                page === currentPage
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className="h-8 gap-1 px-2.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
