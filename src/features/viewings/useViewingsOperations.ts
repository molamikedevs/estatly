import type { ViewingsQueryParams } from "@/types/database"
import { useSearchParams } from "react-router-dom"
import { useViewings } from "./useViewings"

export function useViewingsOperations() {
  const [searchParams] = useSearchParams()

  const params: ViewingsQueryParams = {
    filter: (searchParams.get("status") ??
      "all") as ViewingsQueryParams["filter"],
    sort_by: (searchParams.get("sort_by") ??
      "soonest") as ViewingsQueryParams["sort_by"],
    page: Number(searchParams.get("page")) || 1,
    page_size: Number(searchParams.get("page_size")) || 10,
    query: searchParams.get("query")?.trim() ?? "",
  }

  const { data, isLoading } = useViewings(params)

  const viewings = data?.success ? data.data.viewings : []
  const count = data?.success ? data.data.count : 0
  const error = data && !data.success ? data.error : undefined

  return {
    isLoading,
    success: data?.success ?? false,
    error,
    count,
    viewings,
    isFiltered: params.filter !== "all" || params.query !== "",
  }
}
