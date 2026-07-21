import { getClientApi } from "@/api/apiClients"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useClient() {
  const { clientId } = useParams()
  const id = Number(clientId)

  const {
    isLoading,
    data: client,
    error,
  } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientApi(id),
  })

  return { isLoading, client, error }
}
