import type { ViewingsQueryParams } from "@/types/database"
import { useSearchParams } from "react-router-dom"
import { useViewings } from "./useViewings"

export function useViewingsOperations() {
  const [searchParams] = useSearchParams()

  const params: ViewingsQueryParams = {
    filter: (searchParams.get("status") ??
      "all") as ViewingsQueryParams["filter"],
    sortBy: (searchParams.get("sortBy") ??
      "soonest") as ViewingsQueryParams["sortBy"],
    page: Number(searchParams.get("page")) || 1,
    search: searchParams.get("q")?.trim() ?? "",
  }

  const { data, isLoading } = useViewings(params)

  return {
    isLoading,
    viewings: data?.data ?? [],
    count: data?.count ?? 0,
    isFiltered: params.filter !== "all" || params.search !== "",
  }
}
