import { PAGE_SIZE } from "@/lib/constants"
import { useSearchParams } from "react-router-dom"
import { useViewings } from "./useViewings"

export function useViewingsOperations() {
  const { viewings, isLoading } = useViewings()
  const [searchParams] = useSearchParams()

  const statusFilter = searchParams.get("status") ?? "all"
  const sortBy = searchParams.get("sortBy") ?? "soonest"
  const page = Number(searchParams.get("page")) || 1

  const all = viewings ?? []

  // 1. Filter by status
  const filtered =
    statusFilter === "all" ? all : all.filter((v) => v.status === statusFilter)

  // 2. Sort by scheduled date
  const sorted = [...filtered].sort((a, b) => {
    const aTime = new Date(a.scheduled_at).getTime()
    const bTime = new Date(b.scheduled_at).getTime()
    return sortBy === "latest" ? bTime - aTime : aTime - bTime
  })

  // 3. Paginate
  const from = (page - 1) * PAGE_SIZE
  const paginated = sorted.slice(from, from + PAGE_SIZE)

  const isFiltered = statusFilter !== "all"

  return {
    isLoading,
    isFiltered,
    total: all.length,
    filteredViewings: sorted, // full filtered list — for Pagination's count
    paginatedViewings: paginated, // current page's slice — for the table
  }
}
