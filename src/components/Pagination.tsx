import { PAGE_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { Button } from "./ui/button"

interface PaginationProps {
  count: number
  label?: string
}

export default function Pagination({
  count,
  label = "items",
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get("page")) || 1
  const pageCount = Math.ceil(count / PAGE_SIZE)

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(page))
    setSearchParams(next)
  }

  function nextPage() {
    if (currentPage < pageCount) goToPage(currentPage + 1)
  }

  function prevPage() {
    if (currentPage > 1) goToPage(currentPage - 1)
  }

  if (pageCount <= 1) return null

  const from = (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, count)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-4 sm:flex-row">
      {/* Result range */}
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="tabular font-medium text-foreground">{from}</span>–
        <span className="tabular font-medium text-foreground">{to}</span> of{" "}
        <span className="tabular font-medium text-foreground">{count}</span>{" "}
        {label}
      </p>

      {/* Controls */}
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

        {/* Page numbers */}
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
