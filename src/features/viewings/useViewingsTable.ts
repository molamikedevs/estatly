import { useUser } from "@/features/auth/useUser"
import type { Viewing, ViewingStatus } from "@/types/database"
import { useState } from "react"
import { useDeleteViewing } from "./useDeleteViewing"
import { useSetViewingStatus } from "./useSetViewingStatus"
import { useViewings } from "./useViewings"

export function useViewingsTable() {
  const { user } = useUser()
  // Agents only see their own viewings, so an Agent column tells them nothing
  const showAgent = user?.user_profile?.role !== "agent"

  const { viewings, count, isLoading, error, refetch, isFiltered } =
    useViewings()
  const { setStatus } = useSetViewingStatus()
  const { isPending: isDeleting, deleteViewing } = useDeleteViewing()

  const [deleteTarget, setDeleteTarget] = useState<Viewing>()
  const [rescheduleTarget, setRescheduleTarget] = useState<Viewing>()

  function confirmDelete() {
    if (!deleteTarget) return
    deleteViewing(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return {
    viewings,
    count,
    isLoading,
    error,
    refetch,
    isFiltered,
    showAgent,
    changeStatus: (viewing: Viewing, status: ViewingStatus) =>
      setStatus({ id: viewing.id, status }),
    rescheduleTarget,
    openReschedule: (viewing: Viewing) => setRescheduleTarget(viewing),
    closeReschedule: () => setRescheduleTarget(undefined),
    deleteTarget,
    isDeleting,
    openDelete: (viewing: Viewing) => setDeleteTarget(viewing),
    closeDelete: () => setDeleteTarget(undefined),
    confirmDelete,
  }
}
