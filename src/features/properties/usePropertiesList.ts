import type { Property } from "@/types/database"
import { useState } from "react"
import { useDeleteProperty } from "./useDeleteProperty"
import { useProperties } from "./useProperties"

export function usePropertiesList() {
  const { properties, count, isLoading, error, refetch, isFiltered } =
    useProperties()
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()

  // undefined: closed. A property: open for that property
  const [editTarget, setEditTarget] = useState<Property>()
  const [deleteTarget, setDeleteTarget] = useState<Property>()

  function confirmDelete() {
    if (!deleteTarget) return
    deleteProperty(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return {
    properties,
    count,
    isLoading,
    error,
    refetch,
    isFiltered,
    editTarget,
    openEdit: (property: Property) => setEditTarget(property),
    closeEdit: () => setEditTarget(undefined),
    deleteTarget,
    isDeleting,
    openDelete: (property: Property) => setDeleteTarget(property),
    closeDelete: () => setDeleteTarget(undefined),
    confirmDelete,
  }
}
