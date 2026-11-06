import { useUser } from "@/features/auth/useUser"
import { CLIENT_STAGES } from "@/lib/constants"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
import { useMoveClient } from "./useMoveClient"

// Each stage with its clients, filtered once for the chips and the columns.
// Done here, not in the API: ViewingForm shares the flat ["clients"] cache
function groupByStage(clients: Client[]) {
  return CLIENT_STAGES.map((stage) => ({
    ...stage,
    clients: clients.filter((c) => c.status === stage.status),
  }))
}

export function useClientsBoard() {
  const { user } = useUser()
  // Agents only see their own clients, so the agent line tells them nothing
  const showAgent = user?.user_profile?.role !== "agent"

  const { clients, isLoading, error, refetch } = useClients()
  const { moveClient } = useMoveClient()
  const { isPending: isDeleting, deleteClient } = useDeleteClient()

  const [editTarget, setEditTarget] = useState<Client>()
  const [deleteTarget, setDeleteTarget] = useState<Client>()
  // Phones show one stage at a time
  const [phoneStage, setPhoneStage] = useState<ClientStatus>("active")

  function confirmDelete() {
    if (!deleteTarget) return
    deleteClient(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return {
    clients,
    stages: groupByStage(clients ?? []),
    isLoading,
    error,
    refetch,
    showAgent,
    phoneStage,
    setPhoneStage,
    moveClient,
    editTarget,
    openEdit: (client: Client) => setEditTarget(client),
    closeEdit: () => setEditTarget(undefined),
    deleteTarget,
    isDeleting,
    openDelete: (client: Client) => setDeleteTarget(client),
    closeDelete: () => setDeleteTarget(undefined),
    confirmDelete,
  }
}
