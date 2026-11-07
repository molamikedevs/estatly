import { getBookablePropertiesApi } from "@/api/apiViewings"
import type { Property } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

// Outside the hook, so select keeps the same function and its result is memoized
function toOptions(properties: Pick<Property, "id" | "title">[]) {
  return properties.map((p) => ({ value: String(p.id), label: p.title }))
}

// Under ["properties"], so any property change refreshes the picker too
export function usePropertyOptions() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties", "bookable"],
    queryFn: getBookablePropertiesApi,
    select: toOptions,
  })

  return { propertyOptions: data ?? [], isLoading }
}
