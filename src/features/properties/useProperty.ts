import { getPropertyApi } from "@/api/apiProperties"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useProperty() {
  const { propertyId } = useParams()
  const id = Number(propertyId)
  const isValidId = Number.isInteger(id) && id > 0

  const {
    isLoading,
    data: property,
    error,
    refetch,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyApi(id),
    // A bad URL shows "not found" instead of requesting NaN
    enabled: isValidId,
  })

  return { isLoading, property, error, refetch }
}
