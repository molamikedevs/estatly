import { useDeleteProperty } from "./useDeleteProperty"

/**
 * Thin wrapper over useDeleteProperty that runs a caller-supplied
 * callback after a successful delete. The "what happens next" — close
 * a dialog, clear a selection, navigate away — stays with the caller,
 * since that differs per screen.
 */
export function useConfirmDeleteProperty(onDeleted: () => void) {
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()

  /** Delete the given property id, then run onDeleted on success. */
  function confirmDelete(id: string | undefined) {
    if (!id) return
    deleteProperty(id, { onSuccess: onDeleted })
  }

  return { confirmDelete, isDeleting }
}
