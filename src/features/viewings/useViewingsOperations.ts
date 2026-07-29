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

  return {
    isLoading,
    success: data?.success ?? false,
    error: data?.error,
    count: data?.data?.count ?? 0,
    viewings: data?.data?.viewings ?? [],
    isFiltered: params.filter !== "all" || params.query !== "",
  }
}
