import { getActiveClientsApi } from "@/api/apiViewings"
import type { Client } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

// Outside the hook, so select keeps the same function and its result is memoized
function toOptions(clients: Pick<Client, "id" | "full_name">[]) {
  return clients.map((c) => ({ value: String(c.id), label: c.full_name }))
}

// Under ["clients"], so moving a client to another stage refreshes the picker
export function useClientOptions() {
  const { data, isLoading } = useQuery({
    queryKey: ["clients", "active"],
    queryFn: getActiveClientsApi,
    select: toOptions,
  })

  return { clientOptions: data ?? [], isLoading }
}
