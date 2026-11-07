import { getPropertiesApi } from "@/api/apiProperties"
import { useStepBackFromEmptyPage } from "@/hooks/useStepBackFromEmptyPage"
import { PAGE_SIZE } from "@/lib/constants"
import type { PropertiesQueryParams } from "@/types/database"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

export function useProperties() {
  const [searchParams] = useSearchParams()

  // The URL is the state: shareable, survives a refresh, works with Back
  const params: PropertiesQueryParams = {
    filter: (searchParams.get("listing_type") ??
      "all") as PropertiesQueryParams["filter"],
    sortBy: (searchParams.get("sortBy") ??
      "newest") as PropertiesQueryParams["sortBy"],
    page: Number(searchParams.get("page")) || 1,
    search: searchParams.get("search")?.trim() ?? "",
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["properties", params],
    queryFn: () => getPropertiesApi(params),
    // Keep the current cards on screen while the next page loads
    placeholderData: keepPreviousData,
  })

  useStepBackFromEmptyPage(error, params.page)

  return {
    properties: data?.data,
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
    isFiltered: params.filter !== "all" || params.search !== "",
  }
}
