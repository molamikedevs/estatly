import { getViewingsApi } from "@/api/apiViewings"
import { useStepBackFromEmptyPage } from "@/hooks/useStepBackFromEmptyPage"
import { PAGE_SIZE } from "@/lib/constants"
import type { ViewingsQueryParams } from "@/types/database"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

export function useViewings() {
  const [searchParams] = useSearchParams()

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

  useStepBackFromEmptyPage(error, params.page)

  return {
    viewings: data?.data,
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
    isFiltered: params.filter !== "all" || params.search !== "",
  }
}
