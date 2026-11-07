import { getViewingsApi } from "@/api/apiViewings"
import { PAGE_SIZE } from "@/lib/constants"
import { RequestError } from "@/lib/errors"
import type { ViewingsQueryParams } from "@/types/database"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export function useViewings() {
  const [searchParams, setSearchParams] = useSearchParams()

  // The URL is the state: shareable, survives a refresh, works with Back
  const params: ViewingsQueryParams = {
    filter: (searchParams.get("status") ??
      "all") as ViewingsQueryParams["filter"],
    sortBy: (searchParams.get("sortBy") ??
      "latest") as ViewingsQueryParams["sortBy"],
    page: Number(searchParams.get("page")) || 1,
    search: searchParams.get("search")?.trim() ?? "",
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["viewings", params],
    queryFn: () => getViewingsApi(params),
    // Keep the current rows on screen while the next page loads
    placeholderData: keepPreviousData,
  })

  // Deleting the last viewing on the last page, or changing its status under
  // a filter, leaves the page past the end: step back one page
  const pageIsGone = error instanceof RequestError && error.statusCode === 416

  useEffect(() => {
    if (!pageIsGone || params.page <= 1) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set("page", String(params.page - 1))
        return next
      },
      { replace: true }
    )
  }, [pageIsGone, params.page, setSearchParams])

  return {
    viewings: data?.data,
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
    isFiltered: params.filter !== "all" || params.search !== "",
  }
}
