import { useDeleteProperty } from "./useDeleteProperty"

export function useConfirmDeleteProperty(onDeleted: () => void) {
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()

  /** Delete the given property id, then run onDeleted on success. */
  function confirmDelete(id: string | undefined) {
    if (!id) return
    deleteProperty(id, { onSuccess: onDeleted })
  }

  return { confirmDelete, isDeleting }
}
